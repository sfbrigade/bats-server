class MassCasualtyIncident {
  constructor({
    id,
    incidentNumber,
    address1,
    address2,
    city,
    state,
    zip,
    startedAt,
    endedAt,
    estimatedRedCount,
    estimatedYellowCount,
    estimatedGreenCount,
    estimatedZebraCount,
    updatedAt,
  }) {
    this.id = id;
    this.incidentNumber = incidentNumber;
    this.address1 = address1;
    this.address2 = address2;
    this.city = city;
    this.state = state;
    this.zip = zip;
    this.startedAt = startedAt;
    this.endedAt = endedAt;
    this.estimatedRedCount = estimatedRedCount;
    this.estimatedYellowCount = estimatedYellowCount;
    this.estimatedGreenCount = estimatedGreenCount;
    this.estimatedZebraCount = estimatedZebraCount;
    this.updatedAt = updatedAt;
  }

  get hasAddress() {
    return !!this.address1 || !!this.address2 || !!this.city || !!this.state || !!this.zip;
  }

  get address() {
    let address = this.address1 ?? '';
    if (this.address2) {
      address = `${address}, ${this.address2}`;
    }
    return address;
  }

  get estimatedPatientCount() {
    return (
      (this.estimatedRedCount ?? 0) + (this.estimatedYellowCount ?? 0) + (this.estimatedGreenCount ?? 0) + (this.estimatedZebraCount ?? 0)
    );
  }
}

export default MassCasualtyIncident;
