const ModelMetadata = require('../ModelMetadata');

const fields = [
  {
    // this is the value used to determine who each nurse belongs to
    name: 'id',
    colName: 'hospital_uuid',
    type: 'uuid',
    primaryKey: true,
    autoIncrement: true,
  },
  {
    name: 'OrganizationId',
    colName: 'healthcareorganization_uuid',
    type: 'uuid',
  },
  {
    name: 'name',
    colName: 'hospitalname',
    type: 'string',
    unique: true,
    allowNull: false,
  },
  {
    name: 'state',
    colName: 'hospitalstate',
    type: 'string',
  },
  {
    name: 'stateFacilityCode',
    colName: 'hospitalstatefacilitycode',
    type: 'string',
  },
  {
    name: 'sortSequenceNumber',
    type: 'integer',
  },
  {
    name: 'isActive',
    colName: 'activeindicator',
    type: 'boolean',
    allowNull: false,
    defaultValue: true,
  },
];

module.exports = new ModelMetadata({ modelName: 'Hospital', fields });
