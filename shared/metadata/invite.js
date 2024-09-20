const ModelMetadata = require('../ModelMetadata');

const fields = [
  {
    name: 'id',
    colName: 'invite_uuid',
    type: 'uuid',
    primaryKey: true,
    autoIncrement: true,
  },
  {
    name: 'OrganizationId',
    colName: 'organization_uuid',
    type: 'uuid',
  },
  {
    name: 'firstName',
    type: 'string',
  },
  {
    name: 'lastName',
    type: 'string',
  },
  {
    name: 'email',
    type: 'citext',
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Email cannot be blank',
      },
      notEmpty: {
        msg: 'Email cannot be blank',
      },
    },
  },
  {
    name: 'fullName',
    type: 'virtual',
    typeArgs: ['string', ['firstName', 'lastName']],
    get() {
      return `${this.firstName} ${this.lastName}`.trim();
    },
  },
  {
    name: 'fullNameAndEmail',
    type: 'virtual',
    typeArgs: ['string', ['firstName', 'lastName', 'email']],
    get() {
      return `${this.fullName} <${this.email}>`;
    },
  },
  {
    name: 'message',
    type: 'text',
  },
  {
    name: 'isOperationalUser',
    colName: 'operationaluserindicator',
    type: 'boolean',
    allowNull: false,
    defaultValue: false,
  },
  {
    name: 'isAdminUser',
    colName: 'administrativeuserindicator',
    type: 'boolean',
    allowNull: false,
    defaultValue: false,
  },
  {
    name: 'isSuperUser',
    colName: 'superuserindicator',
    type: 'boolean',
    allowNull: false,
    defaultValue: false,
  },
  {
    name: 'ResentById',
    colName: 'resentuser_uuid',
    type: 'uuid',
  },
  {
    name: 'resentAt',
    colName: 'resenttimestamp',
    type: 'date',
  },
  {
    name: 'AcceptedById',
    colName: 'accepteduser_uuid',
    type: 'uuid',
  },
  {
    name: 'acceptedAt',
    colName: 'acceptedtimestamp',
    type: 'date',
  },
  {
    name: 'RevokedById',
    colName: 'revokeduser_uuid',
    type: 'uuid',
  },
  {
    name: 'revokedAt',
    colName: 'revokedtimestamp',
    type: 'date',
  },
];

module.exports = new ModelMetadata({ modelName: 'Invite', tableName: 'invites', fields });
