import { DateTime } from 'luxon';
import PropTypes from 'prop-types';

const DeliveryStatus = {
  RINGDOWN_SENT: 'RINGDOWN SENT',
  RINGDOWN_RECEIVED: 'RINGDOWN RECEIVED',
  ARRIVED: 'ARRIVED',
  OFFLOADED: 'OFFLOADED',
  RETURNED_TO_SERVICE: 'RETURNED TO SERVICE',
};
DeliveryStatus.ALL_STATUSES = [
  DeliveryStatus.RINGDOWN_SENT,
  DeliveryStatus.RINGDOWN_RECEIVED,
  DeliveryStatus.ARRIVED,
  DeliveryStatus.OFFLOADED,
  DeliveryStatus.RETURNED_TO_SERVICE,
];
Object.freeze(DeliveryStatus);

//
const InputState = {
  NO_INPUT: 'NO_INPUT',
  ERROR: 'ERROR',
  FIXED: 'FIXED',
};
Object.freeze(InputState);

class PatientFieldData {
  constructor(fieldName, fieldOrder, inputState) {
    this.name = fieldName;
    this.order = fieldOrder;
    this.inputState = inputState;
  }
}
//

class Ringdown {
  static get Status() {
    return DeliveryStatus;
  }

  constructor(payload) {
    this.payload = payload || {};
    this.payload.ambulance = this.payload.ambulance || {};
    this.payload.emsCall = this.payload.emsCall || {};
    this.payload.hospital = this.payload.hospital || {};
    this.payload.patient = this.payload.patient || {};
    this.payload.patientDelivery = this.payload.patientDelivery || {};
    // this.payload.formValidation = this.payload.formValidation || {};
    this.validationData = {
      ambulanceIdentifier: new PatientFieldData('ambulanceIdentifier', 0, InputState.NO_INPUT),
      dispatchCallNumber: new PatientFieldData('dispatchCallNumber', 1, InputState.NO_INPUT),
      age: new PatientFieldData('age', 2, InputState.NO_INPUT),
    }
  }

  get id() {
    return this.payload.id;
  }

  // Ambulance

  get ambulance() {
    return this.payload.ambulance ?? {};
  }

  get ambulanceIdentifier() {
    return this.payload.ambulance.ambulanceIdentifier ?? null;
  }

  set ambulanceIdentifier(newValue) {
    this.payload.ambulance.ambulanceIdentifier = newValue;
  }

  // EMS Call

  get emsCall() {
    return this.payload.emsCall ?? {};
  }

  get dispatchCallNumber() {
    return this.payload.emsCall.dispatchCallNumber ?? null;
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

  get age() {
    return this.payload.patient.age ?? null;
  }

  set age(newValue) {
    this.payload.patient.age = newValue;
  }

  get sex() {
    return this.payload.patient.sex ?? null;
  }

  set sex(newValue) {
    this.payload.patient.sex = newValue;
  }

  get emergencyServiceResponseType() {
    return this.payload.patient.emergencyServiceResponseType ?? null;
  }

  set emergencyServiceResponseType(newValue) {
    this.payload.patient.emergencyServiceResponseType = newValue;
  }

  get chiefComplaintDescription() {
    return this.payload.patient.chiefComplaintDescription ?? null;
  }

  set chiefComplaintDescription(newValue) {
    this.payload.patient.chiefComplaintDescription = newValue;
  }

  get stableIndicator() {
    return this.payload.patient.stableIndicator ?? null;
  }

  set stableIndicator(newValue) {
    this.payload.patient.stableIndicator = newValue;
  }

  // Vitals

  get systolicBloodPressure() {
    return this.payload.patient.systolicBloodPressure ?? null;
  }

  set systolicBloodPressure(newValue) {
    this.payload.patient.systolicBloodPressure = newValue;
  }

  get diastolicBloodPressure() {
    return this.payload.patient.diastolicBloodPressure ?? null;
  }

  set diastolicBloodPressure(newValue) {
    this.payload.patient.diastolicBloodPressure = newValue;
  }

  get heartRateBpm() {
    return this.payload.patient.heartRateBpm ?? null;
  }

  set heartRateBpm(newValue) {
    this.payload.patient.heartRateBpm = newValue;
  }

  get respiratoryRate() {
    return this.payload.patient.respiratoryRate ?? null;
  }

  set respiratoryRate(newValue) {
    this.payload.patient.respiratoryRate = newValue;
  }

  get oxygenSaturation() {
    return this.payload.patient.oxygenSaturation ?? null;
  }

  set oxygenSaturation(newValue) {
    this.payload.patient.oxygenSaturation = newValue;
  }

  get lowOxygenResponseType() {
    return this.payload.patient.lowOxygenResponseType ?? null;
  }

  set lowOxygenResponseType(newValue) {
    this.payload.patient.lowOxygenResponseType = newValue;
    if (newValue !== 'SUPPLEMENTAL OXYGEN') {
      this.supplementalOxygenAmount = null;
    }
  }

  get supplementalOxygenAmount() {
    return this.payload.patient.supplementalOxygenAmount ?? null;
  }

  set supplementalOxygenAmount(newValue) {
    this.payload.patient.supplementalOxygenAmount = newValue;
  }

  get temperature() {
    return this.payload.patient.temperature ?? null;
  }

  set temperature(newValue) {
    this.payload.patient.temperature = newValue;
  }

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

  get etohSuspectedIndicator() {
    return this.payload.patient.etohSuspectedIndicator ?? false;
  }

  set etohSuspectedIndicator(newValue) {
    this.payload.patient.etohSuspectedIndicator = newValue;
  }

  get drugsSuspectedIndicator() {
    return this.payload.patient.drugsSuspectedIndicator ?? false;
  }

  set drugsSuspectedIndicator(newValue) {
    this.payload.patient.drugsSuspectedIndicator = newValue;
  }

  get psychIndicator() {
    return this.payload.patient.psychIndicator ?? false;
  }

  set psychIndicator(newValue) {
    this.payload.patient.psychIndicator = newValue;
  }

  get combativeBehaviorIndicator() {
    return this.payload.patient.combativeBehaviorIndicator ?? false;
  }

  set combativeBehaviorIndicator(newValue) {
    this.payload.patient.combativeBehaviorIndicator = newValue;
    this.restraintIndicator = newValue && this.restraintIndicator;
  }

  get restraintIndicator() {
    return this.payload.patient.restraintIndicator ?? false;
  }

  set restraintIndicator(newValue) {
    this.payload.patient.restraintIndicator = newValue;
  }

  get covid19SuspectedIndicator() {
    return this.payload.patient.covid19SuspectedIndicator ?? false;
  }

  set covid19SuspectedIndicator(newValue) {
    this.payload.patient.covid19SuspectedIndicator = newValue;
  }

  get ivIndicator() {
    return this.payload.patient.ivIndicator ?? false;
  }

  set ivIndicator(newValue) {
    this.payload.patient.ivIndicator = newValue;
  }

  get otherObservationNotes() {
    return this.payload.patient.otherObservationNotes ?? null;
  }

  set otherObservationNotes(newValue) {
    this.payload.patient.otherObservationNotes = newValue;
  }

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
    return DateTime.fromISO(this.timestamps[DeliveryStatus.RINGDOWN_SENT]).plus({
      minutes: this.etaMinutes,
    });
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

  // form validation

  validateData(updatedField) {

    function ascendingByOrder(a, b) {
      if (a.order < b.order) {
        return -1;
      }
      if (a.order === b.order) {
        return 0;
      }
      return 1;
    }

    // 1. Handle the updated field
    //  - if status was ERROR, then set it to fixed
    //  - if status was NO_INPUT or FIXED, no need to do anything
    if (this.validationData[updatedField].inputState === InputState.ERROR) {
      this.validationData[updatedField].inputState = InputState.FIXED;
    }

    // 2. Possibly update the input state for fields before the updated field
    //  - Sort the fields in ascending order
    //  - Start at the field before the current field and iterate through the fields in descending order
    //  - if input state is NO_INPUT, set it to error
    //  - if status was ERROR or FIXED, no need to do anything
    const partition = this.validationData[updatedField].order - 1;
    const sorted = Object.values(this.validationData).sort(ascendingByOrder);
    for (let i = partition; i >= 0; i -= 1) {
      if (sorted[i].inputState === InputState.NO_INPUT) {
        const fieldName = sorted[i].name;
        this.validationData[fieldName].inputState = InputState.ERROR;
      }
    }
  }

  getClassName(fieldName){
    
    switch (this.validationData[fieldName].inputState) {
      case InputState.FIXED:
        // TODO - replace this with a success case
        return 'forminput__fixed';
      case InputState.ERROR:
        return 'forminput__error';
      default:
        return '';
    }
  }
  
}

Ringdown.propTypes = {
  ambulanceIdentifier: PropTypes.string.isRequired,
  dispatchCallNumber: PropTypes.number.isRequired,
  hospitalId: PropTypes.string.isRequired,
  // Patient Info
  age: PropTypes.number.isRequired,
  sex: PropTypes.oneOf(['MALE', 'FEMALE', 'NON-BINARY']).isRequired,
  emergencyServiceResponseType: PropTypes.oneOf(['CODE 2', 'CODE 3']).isRequired,
  chiefComplaintDescription: PropTypes.string.isRequired,
  stableIndicator: PropTypes.bool.isRequired,
  // Vitals
  systolicBloodPressure: PropTypes.number,
  diastolicBloodPressure: PropTypes.number,
  heartRateBpm: PropTypes.number,
  respiratoryRate: PropTypes.number,
  oxygenSaturation: PropTypes.number,
  lowOxygenResponseType: PropTypes.oneOf(['ROOM AIR', 'SUPPLEMENTAL OXYGEN']),
  supplementalOxygenAmount: PropTypes.number,
  temperature: PropTypes.number,
  // Addtl. Notes
  etohSuspectedIndicator: PropTypes.bool,
  drugsSuspectedIndicator: PropTypes.bool,
  psychIndicator: PropTypes.bool,
  combativeBehaviorIndicator: PropTypes.bool,
  restraintIndicator: PropTypes.bool,
  covid19SuspectedIndicator: PropTypes.bool,
  ivIndicator: PropTypes.bool,
  otherObservationNotes: PropTypes.string,
  // Status
  etaMinutes: PropTypes.number.isRequired,
  currentDeliveryStatus: PropTypes.oneOf(DeliveryStatus.ALL_STATUSES),
  currentDeliveryStatusDateTimeLocal: PropTypes.instanceOf(Date),
  timestamps: PropTypes.objectOf(PropTypes.instanceOf(Date)),
};

export default Ringdown;
