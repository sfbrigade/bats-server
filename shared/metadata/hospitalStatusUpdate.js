const ModelMetadata = require('../ModelMetadata');

const fields = [
  {
    name: 'id',
    colName: 'hospitalstatusupdate_uuid',
    type: 'uuid',
    primaryKey: true,
    autoIncrement: true,
  },
  {
    name: 'HospitalId',
    colName: 'hospital_uuid',
    type: 'uuid',
    unique: true,
    allowNull: false,
  },
  {
    name: 'EdAdminUserId',
    colName: 'edadminuser_uuid',
    type: 'uuid',
    unique: true,
    allowNull: false,
  },
  {
    name: 'updateDateTimeLocal',
    type: 'date',
    unique: true,
    allowNull: false,
  },
  {
    name: 'mciRedCapacity',
    type: 'integer',
  },
  {
    name: 'mciYellowCapacity',
    type: 'integer',
  },
  {
    name: 'mciGreenCapacity',
    type: 'integer',
  },
  {
    name: 'mciUpdateDateTime',
    type: 'date',
  },
  {
    name: 'openEdBedCount',
    type: 'integer',
    allowNull: false,
  },
  {
    name: 'openPsychBedCount',
    type: 'integer',
    allowNull: false,
  },
  {
    name: 'customInventoryCount',
    type: 'jsonb',
  },
  {
    name: 'bedCountUpdateDateTimeLocal',
    type: 'date',
  },
  {
    name: 'divertStatusIndicator',
    type: 'boolean',
    allowNull: false,
  },
  {
    name: 'divertStatusUpdateDateTimeLocal',
    type: 'date',
  },
  {
    name: 'additionalServiceAvailabilityNotes',
    type: 'text',
    allowNull: true,
  },
  {
    name: 'notesUpdateDateTimeLocal',
    type: 'date',
  },
];

module.exports = new ModelMetadata({ modelName: 'HospitalStatusUpdate', fields });
