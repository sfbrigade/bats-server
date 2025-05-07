const ModelMetadata = require('../ModelMetadata');

const fields = [
  {
    name: 'id',
    colName: 'organization_uuid',
    type: 'uuid',
    primaryKey: true,
    autoIncrement: true,
  },
  {
    name: 'name',
    colName: 'organizationname',
    type: 'string',
    allowNull: false,
  },
  {
    name: 'type',
    colName: 'organizationtypeenum',
    type: 'enum',
    typeArgs: ['EMS', 'HEALTHCARE', 'C4SF', 'VENUE'],
    allowNull: false,
  },
  {
    name: 'state',
    colName: 'organizationstate',
    type: 'string',
  },
  {
    name: 'stateUniqueId',
    colName: 'organizationstateuniqueid',
    type: 'string',
  },
  {
    name: 'timeZone',
    type: 'string',
    defaultValue: 'America/Los_Angeles',
  },
  {
    name: 'isMfaEnabled',
    type: 'boolean',
    allowNull: false,
    defaultValue: false,
  },
  {
    name: 'isActive',
    colName: 'activeindicator',
    type: 'boolean',
    allowNull: false,
    defaultValue: true,
  },
];

module.exports = new ModelMetadata({ modelName: 'Organization', fields });
