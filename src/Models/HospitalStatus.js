class HospitalStatus {
  constructor({
    id,
    hospital,
    openEdBedCount,
    openPsychBedCount,
    bedCountUpdateDateTimeLocal,
    divertStatusIndicator,
    divertStatusUpdateDateTimeLocal,
    updateDateTimeLocal,
    additionalServiceAvailabilityNotes,
    notesUpdateDateTimeLocal,
  }) {
    this.id = id;
    this.hospital = hospital;
    this.hospitalId = hospital?.id;
    this.hospitalName = hospital?.name;
    this.ambulancesEnRoute = hospital?.ambulancesEnRoute;
    this.ambulancesOffloading = hospital?.ambulancesOffloading;
    this.openEdBedCount = openEdBedCount;
    this.openPsychBedCount = openPsychBedCount;
    this.bedCountUpdateDateTimeLocal = bedCountUpdateDateTimeLocal;
    this.divertStatusIndicator = divertStatusIndicator;
    this.divertStatusUpdateDateTimeLocal = divertStatusUpdateDateTimeLocal;
    this.updateDateTimeLocal = updateDateTimeLocal;
    this.additionalServiceAvailabilityNotes = additionalServiceAvailabilityNotes || '';
    this.notesUpdateDateTimeLocal = notesUpdateDateTimeLocal;
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

  toJSON() {
    return {
      hospitalId: this.hospitalId,
      openEdBedCount: this.openEdBedCount,
      openPsychBedCount: this.openPsychBedCount,
      bedCountUpdateDateTimeLocal: this.bedCountUpdateDateTimeLocal,
      additionalServiceAvailabilityNotes: this.additionalServiceAvailabilityNotes,
      notesUpdateDateTimeLocal: this.notesUpdateDateTimeLocal,
      divertStatusIndicator: this.divertStatusIndicator,
      divertStatusUpdateDateTimeLocal: this.divertStatusUpdateDateTimeLocal,
      updateDateTimeLocal: this.updateDateTimeLocal,
    };
  }
}

export default HospitalStatus;
