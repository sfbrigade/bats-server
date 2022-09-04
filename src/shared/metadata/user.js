const ModelMetadata = require('./ModelMetadata');

const fields = [
  {
    name: 'id',
    colName: 'user_uuid',
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
    allowNull: false,
  },
  {
    name: 'lastName',
    type: 'string',
    allowNull: false,
  },
  {
    name: 'name',
    type: 'virtual',
    typeArgs: ['string', ['firstName', 'lastName']],
    get() {
      return `${this.firstName} ${this.lastName}`.trim();
    },
  },
  {
    name: 'email',
    type: 'citext',
    unique: {
      msg: 'This email address has already been used.',
    },
    validate: {
      isEmail: {
        msg: 'This is not a valid email address.',
      },
    },
  },
  {
    name: 'subjectId',
    type: 'string',
  },
  {
    name: 'password',
    type: 'virtual',
    typeArgs: ['string'],
    validate: {
      is: {
        args: [/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/],
        msg: 'At least 8 characters, including upper and lowercase letters, a number, and a symbol.',
      },
    },
  },
  {
    name: 'hashedPassword',
    type: 'string',
  },
  {
    name: 'ssoData',
    type: 'jsonb',
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
    name: 'isActive',
    colName: 'activeindicator',
    type: 'boolean',
    allowNull: false,
    defaultValue: true,
  },
];

module.exports = new ModelMetadata({ modelName: 'User', tableName: 'batsuser', fields });
