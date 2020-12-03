import PropTypes from 'prop-types';

class Ringdown {
  constructor() {
    this.ambulanceIdentifier = null;
    this.dispatchCallNumber = null;
    this.hospitalId = null;
    // Patient Info
    this.age = null;
    this.sex = null;
    this.emergencyServiceResponseType = null;
    this.chiefComplaintDescription = null;
    this.stableIndicator = null;
    // Vitals
    this.systolicBloodPressure = null;
    this.diastolicBloodPressure = null;
    this.heartRateBpm = null;
    this.respiratoryRate = null;
    this.oxygenSaturation = null;
    this._lowOxygenResponseType = null;
    this.supplementalOxygenAmount = null;
    this.temperature = null;
    // Addtl. Notes
    this.etohSuspectedIndicator = false;
    this.drugsSuspectedIndicator = false;
    this.psychIndicator = false;
    this._combativeBehaviorIndicator = false;
    this.restraintIndicator = false;
    this.covid19SuspectedIndicator = false;
    this.ivIndicator = false;
    this.otherObservationNotes = null;
    // Status
    this.etaMinutes = null;
    this.deliveryStatus = null;
    this.ringdownSentDateTimeLocal = null;
    this.ringdownReceivedDateTimeLocal = null;
    this.arrivedDateTimeLocal = null;
    this.offloadedDateTimeLocal = null;
    this.returnToServiceDateTimeLocal = null;
  }

  get combativeBehaviorIndicator() {
    return this._combativeBehaviorIndicator;
  }

  set combativeBehaviorIndicator(newValue) {
    this._combativeBehaviorIndicator = newValue;
    this.restraintIndicator = this._combativeBehaviorIndicator && this.restraintIndicator;
  }

  get lowOxygenResponseType() {
    return this._lowOxygenResponseType;
  }

  set lowOxygenResponseType(newValue) {
    this._lowOxygenResponseType = newValue;
    if (newValue !== 'SUPPLEMENTAL OXYGEN') {
      this.supplementalOxygenAmount = '';
    }
  }

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
    return {
      ambulance: {
        ambulanceIdentifier: this.ambulanceIdentifier,
      },
      emsCall: {
        dispatchCallNumber: this.dispatchCallNumber,
      },
      hospital: {
        id: this.hospitalId,
      },
      patient: {
        age: this.age,
        sex: this.sex,
        emergencyServiceResponseType: this.emergencyServiceResponseType,
        chiefComplaintDescription: this.chiefComplaintDescription,
        stableIndicator: this.stableIndicator,
        // Vitals
        systolicBloodPressure: this.systolicBloodPressure,
        diastolicBloodPressure: this.diastolicBloodPressure,
        heartRateBpm: this.heartRateBpm,
        respiratoryRate: this.respiratoryRate,
        oxygenSaturation: this.oxygenSaturation,
        lowOxygenResponseType: this.lowOxygenResponseType,
        supplementalOxygenAmount: this.supplementalOxygenAmount,
        temperature: this.temperature,
        // Addtl. Notes
        etohSuspectedIndicator: this.etohSuspectedIndicator,
        drugsSuspectedIndicator: this.drugsSuspectedIndicator,
        psychIndicator: this.psychIndicator,
        combativeBehaviorIndicator: this.combativeBehaviorIndicator,
        restraintIndicator: this.restraintIndicator,
        covid19SuspectedIndicator: this.covid19SuspectedIndicator,
        ivIndicator: this.ivIndicator,
        otherObservationNotes: this.otherObservationNotes,
      },
      patientDelivery: {
        etaMinutes: this.etaMinutes,
        deliveryStatus: this.deliveryStatus,
        ringdownSentDateTimeLocal: this.ringdownSentDateTimeLocal,
        ringdownReceivedDateTimeLocal: this.ringdownReceivedDateTimeLocal,
        arrivedDateTimeLocal: this.arrivedDateTimeLocal,
        offloadedDateTimeLocal: this.offloadedDateTimeLocal,
        returnToServiceDateTimeLocal: this.returnToServiceDateTimeLocal,
      },
    };
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
  deliveryStatus: PropTypes.oneOf(['RINGDOWN SENT', 'RINGDOWN RECEIVED', 'ARRIVED', 'OFFLOADED', 'RETURNED TO SERVICE']),
  ringdownSentDateTimeLocal: PropTypes.instanceOf(Date),
  ringdownReceivedDateTimeLocal: PropTypes.instanceOf(Date),
  arrivedDateTimeLocal: PropTypes.instanceOf(Date),
  offloadedDateTimeLocal: PropTypes.instanceOf(Date),
  returnToServiceDateTimeLocal: PropTypes.instanceOf(Date),
};

export default Ringdown;
