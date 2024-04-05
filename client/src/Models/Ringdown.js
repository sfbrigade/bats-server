import { DateTime } from 'luxon';
import PropTypes from 'prop-types';
import * as metadata from 'shared/metadata';
import { DeliveryStatus } from 'shared/constants';
import { isValueEmpty, convertToPropType } from '../utils';
import { PatientFieldData, ValidationState } from './PatientFieldData';

// define the fields that must all have valid input to make the ringdown valid.
// the array order should be the same as the field order in PatientFields.
const validatedFields = [
  'ambulanceIdentifier',
  'dispatchCallNumber',
  'emergencyServiceResponseType',
  'triageTag',
  'triagePriority',
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

const isRangeValid = (value, { max = null, min = null }) => {
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
    this.isMci = false;

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

  get triagePrioritySort() {
    switch (this.triagePriority) {
      case 'RED':
        return 1;
      case 'YELLOW':
        return 2;
      case 'GREEN':
        return 3;
      default:
        return 0;
    }
  }

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

  set timestamps(newTimestamps) {
    this.payload.patientDelivery.timestamps = newTimestamps;
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
      (!this.isMci ||
        (this.isMci && this.triageTag !== null && this.triageTag !== '' && this.triagePriority !== null && this.triagePriority !== '')) &&
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
      this.validationData = validatedFields.reduce((result, fieldName, fieldOlder) => {
        const state = this.getValidationStateForInput(fieldName, this[fieldName]);
        result[fieldName] = new PatientFieldData(fieldName, fieldOlder, state);
        return result;
      }, {});
    }
  }

  validatePatientField(fieldName, inputValue) {
    const field = this.validationData[fieldName];

    // this gets called for all changed fields, but we only validate some of them
    if (field) {
      field.validationState = this.getValidationStateForInput(fieldName, inputValue);

      // show all the empty required fields above this one in an error state
      Object.values(this.validationData)
        .sort(this.ascendingByOrder)
        .slice(0, field.order)
        .filter(({ validationState }) => validationState === ValidationState.EMPTY_REQUIRED_INPUT)
        .forEach(({ name }) => {
          this.validationData[name].validationState = ValidationState.REQUIRED_ERROR;
        });
    }
  }

  getValidationStateForInput(fieldName, inputValue) {
    const { range, required = false } = Ringdown.Fields[fieldName];

    if (isValueEmpty(inputValue)) {
      return required ? ValidationState.EMPTY_REQUIRED_INPUT : ValidationState.EMPTY_INPUT;
    } else if (range && !isRangeValid(inputValue, range)) {
      return ValidationState.RANGE_ERROR;
    } else {
      return required ? ValidationState.REQUIRED_INPUT : ValidationState.INPUT;
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
