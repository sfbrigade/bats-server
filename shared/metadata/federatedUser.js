const ModelMetadata = require('../ModelMetadata');

const fields = [
  {
    name: 'id',
    colName: 'federatedcredential_uuid',
    type: 'uuid',
    primaryKey: true,
  },
  {
    name: 'provider',
    colName: 'provider',
    type: 'string',
    type: 'uuid',
    allowNull: false,
  },
  {
    name: 'subject',
    colName: 'subject',
    type: 'string',
    allowNull: false,
  },
  {
    name: 'userId',
    colName: 'user_id',
    type: 'string',
    allowNull: false,
  },
  
];

module.exports = new ModelMetadata({ modelName: 'FederatedUser', tableName: 'federateduser', fields });