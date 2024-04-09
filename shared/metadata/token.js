const ModelMetadata = require('../ModelMetadata');

const fields = [
  {
    name: 'id',
    colName: 'token_uuid',
    type: 'uuid',
    primaryKey: true,
    autoIncrement: true,
  },
  {
    name: 'accessToken',
    type: 'string',
    allowNull: false,
  },
  {
    name: 'accessTokenExpiresAt',
    type: 'date',
    allowNull: false,
  },
  {
    name: 'clientId',
    colName: 'client_uuid',
    type: 'uuid',
    allowNull: false,
  },
  {
    name: 'refreshToken',
    type: 'string',
  },
  {
    name: 'refreshTokenExpiresAt',
    type: 'date',
  },
  {
    name: 'userId',
    colName: 'user_uuid',
    type: 'uuid',
    allowNull: false,
  },
];

module.exports = new ModelMetadata({ modelName: 'Token', fields });
