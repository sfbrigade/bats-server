const ModelMetadata = require('./ModelMetadata');

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
    enumValues: ['EMS', 'HEALTHCARE', 'C4SF'],
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
    name: 'timeZoneIsoCode',
    colName: 'timezoneisocode',
    type: 'string',
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
