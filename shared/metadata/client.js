const ModelMetadata = require('../ModelMetadata');

const fields = [
  {
    name: 'id',
    colName: 'client_uuid',
    type: 'uuid',
    primaryKey: true,
    autoIncrement: true,
  },
  {
    name: 'name',
    type: 'string',
    allowNull: false,
  },
  {
    name: 'clientId',
    type: 'string',
    allowNull: false,
    unique: {
      msg: 'An client with this id already exists.',
    },
  },
  {
    name: 'hashedClientSecret',
    type: 'text',
    allowNull: false,
  },
  {
    name: 'UserId',
    colName: 'user_uuid',
    type: 'uuid',
  },
  {
    name: 'redirectUri',
    type: 'text',
  },
];

module.exports = new ModelMetadata({ modelName: 'Client', fields });
