class HospitalStatus {
  constructor({
    id,
    hospital,
    openEdBedCount,
    openPsychBedCount,
    divertStatusIndicator,
    updateDateTimeLocal,
    additionalServiceAvailabilityNotes,
  }) {
    this.id = id;
    this.hospitalName = (hospital && hospital.name) || null;
    this.openEdBedCount = openEdBedCount;
    this.openPsychBedCount = openPsychBedCount;
    this.divertStatusIndicator = divertStatusIndicator;
    this.updateDateTimeLocal = updateDateTimeLocal;
    this.additionalServiceAvailabilityNotes = additionalServiceAvailabilityNotes || '';
    this.ambulancesEnRoute = (hospital && hospital.ambulancesEnRoute) || null;
    this.ambulancesOffloading = (hospital && hospital.ambulancesOffloading) || null;
  }

  get isValid() {
    return (
      this.id !== null &&
      this.hospitalName !== null &&
      this.openEdBedCount !== null &&
      this.openPsychBedCount !== null &&
      this.divertStatusIndicator !== null &&
      this.updateDateTimeLocal !== null &&
      this.additionalServiceAvailabilityNotes !== null &&
      this.ambulancesEnRoute !== null &&
      this.ambulancesOffloading !== null
    );
  }
}

export default HospitalStatus;
