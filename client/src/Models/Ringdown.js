/* eslint-disable func-names */
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';
import { isValueEmpty } from '../utils';
import { PatientFieldData, ValidationState } from './PatientFieldData';
import * as metadata from '../../../shared/metadata';
import convertToPropType from '../utils/convertToPropType';
import DeliveryStatus from '../../../shared/constants/DeliveryStatus';

const fieldHashes = {
  ...metadata.patient.getFieldHash(),
  ...metadata.ambulance.getFieldHash(),
  ...metadata.emergencyMedicalServiceCall.getFieldHash(),
};

// define the fields that must all have valid input to make the ringdown valid.  the second array item is an optional function to determine
// whether the field's current value is valid as input.  by default, the field is counted as having input if its value is truthy.   the
// array order should be the same as the field order in PatientFields.

const handleInputValidation = (name, value) => {
  const { type = null, required = false } = fieldHashes[name];

  let isValidType = false;
  switch (type) {
    case 'integer':
      isValidType = typeof value === 'number' && value % 1 === 0;
      break;
    case 'boolean':
      isValidType = typeof value === 'boolean';
      break;
    case 'enum':
    case 'text':
    case 'string':
      isValidType = typeof value === 'string';
      break;
    case 'decimal':
      isValidType = typeof value === 'number';
      break;
    default:
      throw new Error(`Field type value (${type}) has no use case.`);
  }

  return { value, isRequired: required, isValidType };
};
const validatedFields = [
  'ambulanceIdentifier',
  'dispatchCallNumber',
  'emergencyServiceResponseType',
  'age',
  'sex',
  'chiefComplaintDescription',
  'stableIndicator',
  'systolicBloodPressure',
  'diastolicBloodPressure',
  'heartRateBpm',
  'respiratoryRate',
  'oxygenSaturation',
  'supplementalOxygenAmount',
  'temperature',
  'glasgowComaScale',
];

const handleRange = (value, max = null, min = null) => {
  let valueToNumber = Number(value);
  const isNumber = typeof valueToNumber === 'number';
  const hasRangeRequirements = typeof min === 'number' && typeof max === 'number';
  const isWithinRange = valueToNumber >= min && valueToNumber <= max;

  if (hasRangeRequirements) {
    return isNumber && isWithinRange;
  } else {
    return true;
  }
};

// define the names of the objects that will be added to the Ringdown payload property, and the list of its fields for which getters/setters
// will be added.  if the object name is an array, the second string is used as the object name.
const payloadModels = [
  ['ambulance', ['ambulanceIdentifier']],
  [['emergencyMedicalServiceCall', 'emsCall'], ['dispatchCallNumber']],
  // we want to expose the hospital id field under a different name, so we'll define it in the class below instead of here
  ['hospital', []],
  ['patient', metadata.patient.getObjectFields()],
  ['patientDelivery', ['etaMinutes', 'currentDeliveryStatus']],
];

// build a hash with an empty default object for each sub-object in the payload
function createDefaultPayload() {
  const emptyPayload = payloadModels.reduce((result, [name]) => {
    const objectName = name instanceof Array ? name[1] : name;
    result[objectName] = {};
    return result;
  }, {});

  return {
    ...emptyPayload,
    // default the urgency to Code 2 for a fresh ringdown if the Code 3 option has been disabled
    patient: (window.env.REACT_APP_DISABLE_CODE_3 && { emergencyServiceResponseType: 'CODE 2' }) || {},
  };
}

class Ringdown {
  static get Status() {
    return DeliveryStatus;
  }

  static ascendingByOrder(a, b) {
    if (a.order < b.order) {
      return -1;
    }
    if (a.order === b.order) {
      return 0;
    }
    return 1;
  }

  constructor(payload, validationData) {
    this.payload = {
      ...createDefaultPayload(),
      ...payload,
    };

    this.setValidationData(validationData);
  }

  clone() {
    const copy = new Ringdown({ ...this.payload }, { ...this.validationData });
    delete copy.payload.id;
    copy.payload.patientDelivery.currentDeliveryStatus = null;
    copy.hospitalId = null;
    copy.etaMinutes = null;
    return copy;
  }

  get id() {
    return this.payload.id;
  }

  // Hospital

  // special-case this field, since the field name (id) is getting mapped to a different name on the Ringdown (hospitalId)
  get hospitalId() {
    return this.payload.hospital.id ?? null;
  }

  set hospitalId(newValue) {
    this.payload.hospital.id = newValue;
  }

  // Patient Info

  get hasVitals() {
    return !!(
      this.systolicBloodPressure ||
      this.diastolicBloodPressure ||
      this.heartRateBpm ||
      this.respiratoryRate ||
      this.oxygenSaturation ||
      this.lowOxygenResponseType ||
      this.supplementalOxygenAmount ||
      this.temperature
    );
  }

  // Addtl Notes

  get hasAdditionalNotes() {
    return !!(
      this.treatmentNotes ||
      this.etohSuspectedIndicator ||
      this.drugsSuspectedIndicator ||
      this.psychIndicator ||
      this.combativeBehaviorIndicator ||
      this.restraintIndicator ||
      this.covid19SuspectedIndicator ||
      this.ivIndicator ||
      this.glasgowComaScale ||
      this.otherObservationNotes
    );
  }

  // Delivery Status

  get etaDateTimeLocalObj() {
    return this.timestamps[DeliveryStatus.RINGDOWN_SENT]
      ? DateTime.fromISO(this.timestamps[DeliveryStatus.RINGDOWN_SENT]).plus({
          minutes: this.etaMinutes,
        })
      : null;
  }

  get timestamps() {
    return this.payload.patientDelivery.timestamps ?? {};
  }

  // Validators

  get isPatientValid() {
    let hasErrors;
    for (let key in this.validationData) {
      if (
        this.validationData[key].validationState === ValidationState.REQUIRED_ERROR ||
        this.validationData[key].validationState === ValidationState.RANGE_ERROR
      ) {
        hasErrors = true;
      }
    }

    return (
      this.ambulanceIdentifier !== null &&
      this.ambulanceIdentifier !== '' &&
      this.dispatchCallNumber !== null &&
      this.dispatchCallNumber !== '' &&
      this.age !== null &&
      this.age !== '' &&
      this.sex !== null &&
      this.sex !== '' &&
      this.emergencyServiceResponseType !== null &&
      this.emergencyServiceResponseType !== '' &&
      this.chiefComplaintDescription !== null &&
      this.chiefComplaintDescription !== '' &&
      this.stableIndicator !== null &&
      !hasErrors
    );
  }

  get isValid() {
    return this.isPatientValid && this.hospitalId !== null && this.etaMinutes !== null;
  }

  toJSON() {
    return this.payload;
  }

  // Form validation

  setValidationData(validationData) {
    if (validationData) {
      this.validationData = validationData;
    } else {
      this.validationData = validatedFields.reduce((result, field, i) => {
        const fieldValue = this[field];
        const { value, isRequired } = handleInputValidation(field, fieldValue);
        let state;
        if (isRequired) {
          state = value ? ValidationState.REQUIRED_INPUT : ValidationState.EMPTY_REQUIRED_INPUT;
        } else {
          state = value ? ValidationState.INPUT : ValidationState.EMPTY_INPUT;
        }
        result[field] = new PatientFieldData(field, i, state);

        return result;
      }, {});
    }
  }

  validatePatientFields(updatedField, inputValue) {
    const updatedFieldHasValidations = updatedField in this.validationData;

    if (updatedFieldHasValidations) {
      const currentState = this.validationData[updatedField].validationState;
      this.setValidationStateForInput(updatedField, currentState, inputValue);
    }

    const partition = updatedFieldHasValidations ? this.validationData[updatedField].order : null;
    const sorted = Object.values(this.validationData).sort(this.ascendingByOrder);
    const previousFields = sorted.slice(0, partition);
    previousFields
      .filter((fieldData) => fieldData.validationState === ValidationState.EMPTY_REQUIRED_INPUT)
      .forEach((fieldData) => {
        this.validationData[fieldData.name].validationState = ValidationState.REQUIRED_ERROR;
      });
  }

  setValidationStateForInput(fieldName, currentState, inputValue) {
    const isInputValueEmpty = isValueEmpty(inputValue);
    const { range, required = false } = fieldHashes[fieldName];
    const isInRange = range && handleRange(inputValue, range.max, range.min);

    switch (currentState) {
      case ValidationState.REQUIRED_ERROR:
      case ValidationState.EMPTY_REQUIRED_INPUT:
      case ValidationState.EMPTY_INPUT:
        if (!isInputValueEmpty) {
          if (range && !isInRange) {
            this.validationData[fieldName].validationState = ValidationState.RANGE_ERROR;
          } else {
            this.validationData[fieldName].validationState = required ? ValidationState.REQUIRED_INPUT : ValidationState.INPUT;
          }
        } else {
          this.validationData[fieldName].validationState = required ? ValidationState.EMPTY_REQUIRED_INPUT : ValidationState.EMPTY_INPUT;
        }
        break;
      case ValidationState.REQUIRED_INPUT:
      case ValidationState.INPUT:
        if (range && !isInRange) {
          this.validationData[fieldName].validationState = ValidationState.RANGE_ERROR;
        }
        if (isInputValueEmpty) {
          this.validationData[fieldName].validationState = required ? ValidationState.EMPTY_REQUIRED_INPUT : ValidationState.EMPTY_INPUT;
        }
        break;
      case ValidationState.RANGE_ERROR:
        if (isInRange) {
          this.validationData[fieldName].validationState = required ? ValidationState.REQUIRED_INPUT : ValidationState.INPUT;
        } else if (isInputValueEmpty) {
          this.validationData[fieldName].validationState = required ? ValidationState.EMPTY_REQUIRED_INPUT : ValidationState.EMPTY_INPUT;
        }
        break;
      default:
        throw new Error(`currentState value (${currentState}) has no current use case.`);
    }
  }

  getValidationState(fieldName) {
    return this.validationData[fieldName]?.validationState;
  }
}

// complete the scaffolding of the Ringdown class in this IIFE
(() => {
  function attachFields(target, objectName, fields) {
    const props = {};

    fields.forEach((field) => {
      props[field.name] = {
        get() {
          return this.payload[objectName][field.name] ?? field.defaultValue;
        },
        set(newValue) {
          this.payload[objectName][field.name] = newValue;
        },
        configurable: true,
        enumerable: true,
      };
    });

    Object.defineProperties(target, props);
  }

  function overrideSetter(target, key, setter) {
    const descriptor = Object.getOwnPropertyDescriptor(target, key);

    if (!descriptor || !descriptor.set) {
      throw new Error(`setter for '${key}' does not exist on the target.`);
    }

    Object.defineProperty(target, key, {
      ...descriptor,
      set: setter,
    });
  }

  const ringdownFields = {
    // special case hospitalId, since it's not created via the payloadModels loop below
    hospitalId: metadata.hospital.getFieldHash().id,
  };

  // add the getters and setters to the Ringdown prototype for each field of each object in the payload
  payloadModels.forEach(([modelInfo, fieldNames]) => {
    let metadataName = modelInfo;
    let objectName = modelInfo;

    if (modelInfo instanceof Array) {
      // this model is being aliased under a different name on the Ringdown
      [metadataName, objectName] = modelInfo;
    }

    // get the ModelMetadata fields, either filtering by the list of strings in payloadModels or the prefetched array
    const fields =
      typeof fieldNames[0] === 'string' ? metadata[metadataName].getFields(undefined, ({ name }) => fieldNames.includes(name)) : fieldNames;

    // add a getter/setter for each field
    attachFields(Ringdown.prototype, objectName, fields);

    fields.forEach((field) => (ringdownFields[field.name] = field));

    // add a getter to return this payload sub-object
    Object.defineProperties(Ringdown.prototype, {
      [objectName]: {
        get() {
          return this.payload[objectName];
        },
        configurable: true,
        enumerable: true,
      },
    });
  });

  // we need to add custom setters for these payload fields, since setting their values affects other fields
  overrideSetter(Ringdown.prototype, 'lowOxygenResponseType', function (newValue) {
    this.payload.patient.lowOxygenResponseType = newValue;
    if (newValue !== 'SUPPLEMENTAL OXYGEN') {
      this.supplementalOxygenAmount = null;
    }
  });
  overrideSetter(Ringdown.prototype, 'combativeBehaviorIndicator', function (newValue) {
    this.payload.patient.combativeBehaviorIndicator = newValue;
    this.restraintIndicator = newValue && this.restraintIndicator;
  });

  Ringdown.Fields = Object.freeze(ringdownFields);
})();

Ringdown.propTypes = {
  ambulanceIdentifier: PropTypes.string.isRequired,
  dispatchCallNumber: PropTypes.number.isRequired,
  hospitalId: PropTypes.string.isRequired,
  // Patient Info
  ...metadata.patient.getFieldHash(convertToPropType),
  // Status
  etaMinutes: PropTypes.number.isRequired,
  currentDeliveryStatus: PropTypes.oneOf(DeliveryStatus.ALL_STATUSES),
  currentDeliveryStatusDateTimeLocal: PropTypes.instanceOf(Date),
  timestamps: PropTypes.objectOf(PropTypes.instanceOf(Date)),
};

export default Ringdown;
