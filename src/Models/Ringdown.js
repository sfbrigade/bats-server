import { DateTime } from 'luxon';
import PropTypes from 'prop-types';
import { PatientFieldData, ValidationState } from './PatientFieldData';
import patient from '../shared/metadata/patient';
import convertToPropType from '../shared/convertToPropType';
import DeliveryStatus from '../shared/constants/DeliveryStatus';

function attachFields(target, fields, data) {
  const props = {};

  fields.forEach((field) => {
    props[field.name] = {
      get() {
        return data[field.name] ?? field.defaultValue;
      },
      set(newValue) {
        data[field.name] = newValue;
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

// specify the fields that must all have valid input to make the ringdown valid.  the second array item is an optional function to determine
// whether the field's current value is valid as input.  the array order should be the same as the field order in PatientFields.
const validatedFields = [
  ['ambulanceIdentifier'],
  ['dispatchCallNumber'],
  ['emergencyServiceResponseType'],
  ['age'],
  ['sex'],
  ['chiefComplaintDescription'],
  ['stableIndicator', (value) => typeof value === 'boolean'],
  ['all', () => ValidationState.NO_INPUT],
];

class Ringdown {
  static get Status() {
    return DeliveryStatus;
  }

  constructor(payload, validationData) {
    this.payload = payload || {};
    this.payload.ambulance = this.payload.ambulance || {};
    this.payload.emsCall = this.payload.emsCall || {};
    this.payload.hospital = this.payload.hospital || {};
    // default the urgency to Code 2 for a fresh ringdown if the Code 3 option has been disabled
    this.payload.patient =
      this.payload.patient || (window.env.REACT_APP_DISABLE_CODE_3 && { emergencyServiceResponseType: 'CODE 2' }) || {};
    this.payload.patientDelivery = this.payload.patientDelivery || {};

    // add getters/setters for patient fields
    attachFields(this, patient.getObjectFields(), this.payload.patient);

    // add custom setters for these payload fields, since their settings affect other fields
    overrideSetter(this, 'lowOxygenResponseType', (newValue) => {
      this.payload.patient.lowOxygenResponseType = newValue;
      if (newValue !== 'SUPPLEMENTAL OXYGEN') {
        this.supplementalOxygenAmount = null;
      }
    });
    overrideSetter(this, 'combativeBehaviorIndicator', (newValue) => {
      this.payload.patient.combativeBehaviorIndicator = newValue;
      this.restraintIndicator = newValue && this.restraintIndicator;
    });

    this.validationData = validationData || this.createValidationData(validatedFields);
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

  // Ambulance

  get ambulance() {
    return this.payload.ambulance ?? {};
  }

  get ambulanceIdentifier() {
    return this.payload.ambulance.ambulanceIdentifier ?? '';
  }

  set ambulanceIdentifier(newValue) {
    this.payload.ambulance.ambulanceIdentifier = newValue;
  }

  // EMS Call

  get emsCall() {
    return this.payload.emsCall ?? {};
  }

  get dispatchCallNumber() {
    return this.payload.emsCall.dispatchCallNumber ?? '';
  }

  set dispatchCallNumber(newValue) {
    this.payload.emsCall.dispatchCallNumber = newValue;
  }

  // Hospital

  get hospital() {
    return this.payload.hospital ?? {};
  }

  get hospitalId() {
    return this.payload.hospital.id ?? null;
  }

  set hospitalId(newValue) {
    this.payload.hospital.id = newValue;
  }

  // Patient Info

  get hasVitals() {
    return (
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
    return (
      this.etohSuspectedIndicator ||
      this.drugsSuspectedIndicator ||
      this.psychIndicator ||
      this.combativeBehaviorIndicator ||
      this.restraintIndicator ||
      this.covid19SuspectedIndicator ||
      this.ivIndicator ||
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

  get etaMinutes() {
    return this.payload.patientDelivery.etaMinutes ?? null;
  }

  set etaMinutes(newValue) {
    this.payload.patientDelivery.etaMinutes = newValue;
  }

  get currentDeliveryStatus() {
    return this.payload.patientDelivery.currentDeliveryStatus ?? null;
  }

  set currentDeliveryStatus(newValue) {
    this.payload.patientDelivery.currentDeliveryStatus = newValue;
  }

  get timestamps() {
    return this.payload.patientDelivery.timestamps ?? {};
  }

  // Validators

  get isPatientValid() {
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
      this.stableIndicator !== null
    );
  }

  get isValid() {
    return this.isPatientValid && this.hospitalId !== null && this.etaMinutes !== null;
  }

  toJSON() {
    return this.payload;
  }

  // Form validation

  static ascendingByOrder(a, b) {
    if (a.order < b.order) {
      return -1;
    }
    if (a.order === b.order) {
      return 0;
    }
    return 1;
  }

  createValidationData(fields) {
    return fields.reduce((result, field, i) => {
      const [name, validator] = field;
      const fieldValue = this[name];
      const value = typeof validator === 'function' ? validator(fieldValue) : fieldValue;
      const state = value ? ValidationState.INPUT : ValidationState.NO_INPUT;

      result[name] = new PatientFieldData(name, i, state);

      return result;
    }, {});
  }

  validatePatientFields(updatedField, inputValue) {
    const updatedFieldHasValidations = updatedField in this.validationData;

    if (updatedFieldHasValidations) {
      const currentState = this.validationData[updatedField].validationState;
      this.setValidationStateForInput(updatedField, currentState, inputValue);
    }

    const partition = updatedFieldHasValidations ? this.validationData[updatedField].order : this.validationData.all.order;
    const sorted = Object.values(this.validationData).sort(this.ascendingByOrder);
    const previousFields = sorted.slice(0, partition);
    previousFields
      .filter((fieldData) => fieldData.validationState === ValidationState.NO_INPUT)
      .forEach((fieldData) => {
        this.validationData[fieldData.name].validationState = ValidationState.ERROR;
      });
  }

  setValidationStateForInput(fieldName, currentState, inputValue) {
    const inputValueType = typeof inputValue;
    // count 0 and false as non-empty values
    const isInputValueEmpty = inputValueType !== 'number' && inputValueType !== 'boolean' && !inputValue;

    if (currentState === ValidationState.ERROR && !isInputValueEmpty) {
      this.validationData[fieldName].validationState = ValidationState.FIXED;
    } else if (currentState === ValidationState.NO_INPUT) {
      this.validationData[fieldName].validationState = ValidationState.INPUT;
    } else if (currentState === ValidationState.INPUT && isInputValueEmpty) {
      this.validationData[fieldName].validationState = ValidationState.ERROR;
    } else if (currentState === ValidationState.FIXED && isInputValueEmpty) {
      this.validationData[fieldName].validationState = ValidationState.ERROR;
    }
  }

  getValidationState(fieldName) {
    return this.validationData[fieldName]?.validationState;
  }
}

Ringdown.propTypes = {
  ambulanceIdentifier: PropTypes.string.isRequired,
  dispatchCallNumber: PropTypes.number.isRequired,
  hospitalId: PropTypes.string.isRequired,
  // Patient Info
  ...patient.getFieldHash(convertToPropType),
  // Status
  etaMinutes: PropTypes.number.isRequired,
  currentDeliveryStatus: PropTypes.oneOf(DeliveryStatus.ALL_STATUSES),
  currentDeliveryStatusDateTimeLocal: PropTypes.instanceOf(Date),
  timestamps: PropTypes.objectOf(PropTypes.instanceOf(Date)),
};

export default Ringdown;
