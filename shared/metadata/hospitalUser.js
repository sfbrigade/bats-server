const ModelMetadata = require('../ModelMetadata');

const fields = [
  {
    name: 'id',
    colName: 'hospitaluser_uuid',
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
    name: 'isActive',
    colName: 'activeindicator',
    type: 'boolean',
    allowNull: false,
    defaultValue: true,
  },
  {
    name: 'isInfoUser',
    colName: 'infouserindicator',
    type: 'boolean',
    allowNull: false,
    defaultValue: true,
  },
  {
    name: 'isRingdownUser',
    colName: 'ringdownuserindicator',
    type: 'boolean',
    allowNull: false,
    defaultValue: true,
  },
];

module.exports = new ModelMetadata({ modelName: 'HospitalUser', fields });
