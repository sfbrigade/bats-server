class HospitalStatus {
  constructor({
    id,
    hospital,
    mciRedCapacity,
    mciYellowCapacity,
    mciGreenCapacity,
    openEdBedCount,
    openPsychBedCount,
    customInventoryCount,
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
    this.mciRedCapacity = mciRedCapacity;
    this.mciYellowCapacity = mciYellowCapacity;
    this.mciGreenCapacity = mciGreenCapacity;
    this.openEdBedCount = openEdBedCount;
    this.openPsychBedCount = openPsychBedCount;
    this.customInventoryCount = customInventoryCount;
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
      mciRedCapacity: this.mciRedCapacity,
      mciYellowCapacity: this.mciYellowCapacity,
      mciGreenCapacity: this.mciGreenCapacity,
      openEdBedCount: this.openEdBedCount,
      openPsychBedCount: this.openPsychBedCount,
      customInventoryCount: this.customInventoryCount,
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
