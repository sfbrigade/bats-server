const ModelMetadata = require('../ModelMetadata');

const fields = [
  {
    name: 'id',
    colName: 'hospitalinvite_uuid',
    type: 'uuid',
    primaryKey: true,
    autoIncrement: true,
  },
  {
    name: 'HospitalId',
    colName: 'hospital_uuid',
    type: 'uuid',
    allowNull: false,
  },
  {
    name: 'InviteId',
    colName: 'invite_uuid',
    type: 'uuid',
    allowNull: false,
  },
  {
    name: 'isActive',
    colName: 'activeindicator',
    type: 'boolean',
    allowNull: false,
    defaultValue: false,
  },
  {
    name: 'isInfoUser',
    colName: 'infouserindicator',
    type: 'boolean',
    allowNull: false,
    defaultValue: false,
  },
  {
    name: 'isRingdownUser',
    colName: 'ringdownuserindicator',
    type: 'boolean',
    allowNull: false,
    defaultValue: false,
  },
];

module.exports = new ModelMetadata({ modelName: 'HospitalInvite', fields });
