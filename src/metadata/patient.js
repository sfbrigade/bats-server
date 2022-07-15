const { DataTypes } = require('sequelize');
const Metadata = require('./Metadata');

const fields = [
  {
    name: 'id',
    colName: 'patient_uuid',
    type: DataTypes.UUID,
    primaryKey: true,
    autoIncrement: true,
  },
  {
    name: 'EmergencyMedicalServiceCallId',
    colName: 'emergencymedicalservicecall_uuid',
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
  },
  {
    name: 'age',
    type: DataTypes.INTEGER,
  },
  {
    name: 'sex',
    type: DataTypes.ENUM('MALE', 'FEMALE', 'NON-BINARY'),
  },
  {
    name: 'emergencyServiceResponseType',
    type: DataTypes.ENUM('CODE 2', 'CODE 3'),
  },
  {
    name: 'chiefComplaintDescription',
    type: DataTypes.TEXT,
  },
  {
    name: 'stableIndicator',
    type: DataTypes.BOOLEAN,
  },
  {
    name: 'systolicBloodPressure',
    type: DataTypes.INTEGER,
  },
  {
    name: 'diastolicBloodPressure',
    type: DataTypes.INTEGER,
  },
  {
    name: 'heartRateBpm',
    type: DataTypes.INTEGER,
  },
  {
    name: 'respiratoryRate',
    type: DataTypes.INTEGER,
  },
  {
    name: 'oxygenSaturation',
    type: DataTypes.INTEGER,
  },
  {
    name: 'lowOxygenResponseType',
    type: DataTypes.ENUM('ROOM AIR', 'SUPPLEMENTAL OXYGEN'),
  },
  {
    name: 'supplementalOxygenAmount',
    type: DataTypes.INTEGER,
  },
  {
    name: 'temperature',
    type: DataTypes.DECIMAL,
  },
  {
    name: 'etohSuspectedIndicator',
    type: DataTypes.BOOLEAN,
  },
  {
    name: 'drugsSuspectedIndicator',
    type: DataTypes.BOOLEAN,
  },
  {
    name: 'psychIndicator',
    type: DataTypes.BOOLEAN,
  },
  {
    name: 'combativeBehaviorIndicator',
    type: DataTypes.BOOLEAN,
  },
  {
    name: 'restraintIndicator',
    type: DataTypes.BOOLEAN,
  },
  {
    name: 'covid19SuspectedIndicator',
    colName: 'covid-19suspectedindicator',
    type: DataTypes.BOOLEAN,
  },
  {
    name: 'ivIndicator',
    colName: 'ivindicator',
    type: DataTypes.BOOLEAN,
  },
  {
    name: 'otherObservationNotes',
    colName: 'otherobservationnotes',
    type: DataTypes.TEXT,
  },
  {
    name: 'createdAt',
    colName: 'recordcreatetimestamp',
    type: DataTypes.DATE,
  },
  {
    name: 'CreatedById',
    colName: 'recordcreateuser_uuid',
    type: DataTypes.UUID,
  },
  {
    name: 'updatedAt',
    colName: 'recordupdatetimestamp',
    type: DataTypes.DATE,
  },
  {
    name: 'UpdatedById',
    colName: 'recordupdateuser_uuid',
    type: DataTypes.UUID,
  },
];

module.exports = new Metadata(fields);
