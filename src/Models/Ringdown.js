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
  }

  get id() {
    return this.payload.id;
  }

  // Ambulance

  get ambulanceIdentifier() {
    return this.payload.ambulance.ambulanceIdentifier ?? null;
  }

  set ambulanceIdentifier(newValue) {
    this.payload.ambulance.ambulanceIdentifier = newValue;
  }

  // EMS Call

  get dispatchCallNumber() {
    return this.payload.emsCall.dispatchCallNumber ?? null;
  }

  set dispatchCallNumber(newValue) {
    this.payload.emsCall.dispatchCallNumber = newValue;
  }

  // Hospital

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
    return DateTime.fromISO(this.ringdownSentDateTimeLocal).plus({
      minutes: this.etaMinutes,
    });
  }

  get etaMinutes() {
    return this.payload.patientDelivery.etaMinutes ?? null;
  }

  set etaMinutes(newValue) {
    this.payload.patientDelivery.etaMinutes = newValue;
  }

  get deliveryStatus() {
    return this.payload.patientDelivery.deliveryStatus ?? null;
  }

  set deliveryStatus(newValue) {
    this.payload.patientDelivery.deliveryStatus = newValue;
  }

  get ringdownSentDateTimeLocal() {
    return this.payload.patientDelivery.ringdownSentDateTimeLocal ?? null;
  }

  set ringdownSentDateTimeLocal(newValue) {
    this.payload.patientDelivery.ringdownSentDateTimeLocal = newValue;
  }

  get ringdownReceivedDateTimeLocal() {
    return this.payload.patientDelivery.ringdownReceivedDateTimeLocal ?? null;
  }

  set ringdownReceivedDateTimeLocal(newValue) {
    this.payload.patientDelivery.ringdownReceivedDateTimeLocal = newValue;
  }

  get arrivedDateTimeLocal() {
    return this.payload.patientDelivery.arrivedDateTimeLocal ?? null;
  }

  set arrivedDateTimeLocal(newValue) {
    this.payload.patientDelivery.arrivedDateTimeLocal = newValue;
  }

  get offloadedDateTimeLocal() {
    return this.payload.patientDelivery.offloadedDateTimeLocal ?? null;
  }

  set offloadedDateTimeLocal(newValue) {
    this.payload.patientDelivery.offloadedDateTimeLocal = newValue;
  }

  get returnToServiceDateTimeLocal() {
    return this.payload.patientDelivery.returnToServiceDateTimeLocal ?? null;
  }

  set returnToServiceDateTimeLocal(newValue) {
    this.payload.patientDelivery.returnToServiceDateTimeLocal = newValue;
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
  deliveryStatus: PropTypes.oneOf(DeliveryStatus.ALL_STATUSES),
  ringdownSentDateTimeLocal: PropTypes.instanceOf(Date),
  ringdownReceivedDateTimeLocal: PropTypes.instanceOf(Date),
  arrivedDateTimeLocal: PropTypes.instanceOf(Date),
  offloadedDateTimeLocal: PropTypes.instanceOf(Date),
  returnToServiceDateTimeLocal: PropTypes.instanceOf(Date),
};

export default Ringdown;
