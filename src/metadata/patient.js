const ModelMetadata = require('./ModelMetadata');

const fields = [
  {
    name: 'id',
    colName: 'patient_uuid',
    type: 'uuid',
    primaryKey: true,
    autoIncrement: true,
  },
  {
    name: 'EmergencyMedicalServiceCallId',
    colName: 'emergencymedicalservicecall_uuid',
    type: 'uuid',
    allowNull: false,
    unique: true,
  },
  {
    name: 'emergencyServiceResponseType',
    type: 'enum',
    enumValues: ['CODE 2', 'CODE 3'],
    required: true,
  },
  {
    name: 'age',
    type: 'integer',
    label: 'Age (estimated)',
    unit: 'years',
    required: true,
    range: { min: 0, max: 130 },
  },
  {
    name: 'sex',
    type: 'enum',
    enumValues: ['MALE', 'FEMALE', 'NON-BINARY'],
    required: true,
  },
  {
    name: 'chiefComplaintDescription',
    type: 'text',
    label: 'Chief Complaint',
    required: true,
  },
  {
    name: 'stableIndicator',
    type: 'boolean',
    // though this is stored as a boolean, it's rendered in the UI as two radio buttons, not a
    // checkbox, so use null as the default so neither radio is selected
    defaultValue: null,
    required: true,
  },
  {
    name: 'systolicBloodPressure',
    type: 'integer',
    range: { min: 90, max: 180 },
  },
  {
    name: 'diastolicBloodPressure',
    type: 'integer',
    range: { min: 60, max: 120 },
  },
  {
    name: 'heartRateBpm',
    type: 'integer',
    label: 'Pulse',
    unit: 'beats/min',
    range: { min: 40, max: 200 },
  },
  {
    name: 'respiratoryRate',
    type: 'integer',
    label: 'Respiratory Rate',
    unit: 'breaths/min',
    range: { min: 12, max: 25 },
  },
  {
    name: 'oxygenSaturation',
    type: 'integer',
    label: 'SpO2',
    unit: '%',
    range: { min: 0, max: 100 },
  },
  {
    name: 'lowOxygenResponseType',
    type: 'enum',
    enumValues: ['ROOM AIR', 'SUPPLEMENTAL OXYGEN'],
  },
  {
    name: 'supplementalOxygenAmount',
    type: 'integer',
    unit: 'L',
    range: { min: 1, max: 1000 },
  },
  {
    name: 'temperature',
    type: 'decimal',
    label: 'Temperature',
    unit: '°F',
    range: { min: 80, max: 150 },
  },
  {
    name: 'treatmentNotes',
    type: 'text',
    label: 'Treatments Administered',
  },
  {
    name: 'etohSuspectedIndicator',
    type: 'boolean',
    label: 'ETOH suspected',
  },
  {
    name: 'drugsSuspectedIndicator',
    type: 'boolean',
    label: 'Drugs suspected',
  },
  {
    name: 'psychIndicator',
    type: 'boolean',
    label: 'Behavioral health needs',
  },
  {
    name: 'combativeBehaviorIndicator',
    type: 'boolean',
    label: 'Combative',
  },
  {
    name: 'restraintIndicator',
    type: 'boolean',
    label: '4-point restraint',
  },
  {
    name: 'covid19SuspectedIndicator',
    colName: 'covid-19suspectedindicator',
    type: 'boolean',
    label: 'COVID-19 suspected',
  },
  {
    name: 'ivIndicator',
    type: 'boolean',
  },
  {
    name: 'glasgowComaScale',
    type: 'integer',
    label: 'GCS',
    unit: '/ 15',
    range: { min: 3, max: 15 },
  },
  {
    name: 'otherObservationNotes',
    type: 'text',
    label: 'Other',
  },
  {
    name: 'createdAt',
    colName: 'recordcreatetimestamp',
    type: 'date',
  },
  {
    name: 'CreatedById',
    colName: 'recordcreateuser_uuid',
    type: 'uuid',
  },
  {
    name: 'updatedAt',
    colName: 'recordupdatetimestamp',
    type: 'date',
  },
  {
    name: 'UpdatedById',
    colName: 'recordupdateuser_uuid',
    type: 'uuid',
  },
];

module.exports = new ModelMetadata({ modelName: 'Patient', fields });
