const ModelMetadata = require('../ModelMetadata');

const fields = [
  {
    name: 'id',
    colName: 'assignment_uuid',
    type: 'uuid',
    primaryKey: true,
    autoIncrement: true,
  },
  {
    name: 'FromOrganizationId',
    colName: 'fromorganization_uuid',
    type: 'uuid',
  },
  {
    name: 'ToOrganizationId',
    colName: 'toorganization_uuid',
    type: 'uuid',
  },
  {
    name: 'deletedAt',
    colName: 'recorddeletetimestamp',
    type: 'date',
  },
  {
    name: 'DeletedById',
    colName: 'recorddeleteuser_uuid',
    type: 'uuid',
  },
];

module.exports = new ModelMetadata({ modelName: 'Assignment', fields });
