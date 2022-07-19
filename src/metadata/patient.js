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
    name: 'age',
    type: 'integer',
    required: true,
  },
  {
    name: 'sex',
    type: 'enum',
    enumValues: ['MALE', 'FEMALE', 'NON-BINARY'],
    required: true,
  },
  {
    name: 'emergencyServiceResponseType',
    type: 'enum',
    enumValues: ['CODE 2', 'CODE 3'],
    required: true,
  },
  {
    name: 'chiefComplaintDescription',
    type: 'text',
    required: true,
  },
  {
    name: 'stableIndicator',
    type: 'boolean',
    required: true,
  },
  {
    name: 'systolicBloodPressure',
    type: 'integer',
  },
  {
    name: 'diastolicBloodPressure',
    type: 'integer',
  },
  {
    name: 'heartRateBpm',
    type: 'integer',
  },
  {
    name: 'respiratoryRate',
    type: 'integer',
  },
  {
    name: 'oxygenSaturation',
    type: 'integer',
  },
  {
    name: 'lowOxygenResponseType',
    type: 'enum',
    enumValues: ['ROOM AIR', 'SUPPLEMENTAL OXYGEN'],
  },
  {
    name: 'supplementalOxygenAmount',
    type: 'integer',
  },
  {
    name: 'temperature',
    type: 'decimal',
  },
  {
    name: 'etohSuspectedIndicator',
    type: 'boolean',
  },
  {
    name: 'drugsSuspectedIndicator',
    type: 'boolean',
  },
  {
    name: 'psychIndicator',
    type: 'boolean',
  },
  {
    name: 'combativeBehaviorIndicator',
    type: 'boolean',
  },
  {
    name: 'restraintIndicator',
    type: 'boolean',
  },
  {
    name: 'covid19SuspectedIndicator',
    colName: 'covid-19suspectedindicator',
    type: 'boolean',
  },
  {
    name: 'ivIndicator',
    type: 'boolean',
  },
  {
    name: 'otherObservationNotes',
    type: 'text',
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

module.exports = new ModelMetadata(fields);
