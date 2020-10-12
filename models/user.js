const bcrypt = require('bcrypt');
const { Model } = require('sequelize');

const SALT_ROUNDS = 10;

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Organization, { as: 'organization' });

      User.belongsTo(models.User, { as: 'createdBy' });
      User.belongsTo(models.User, { as: 'updatedBy' });
    }
  }

  User.init(
    {
      id: {
        field: 'user_uuid',
        type: DataTypes.UUID,
        primaryKey: true,
        autoIncrement: true,
      },
      organizationId: {
        field: 'organization_uuid',
        type: DataTypes.UUID,
      },
      firstName: {
        field: 'firstname',
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        field: 'lastname',
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        field: 'email',
        type: DataTypes.CITEXT,
      },
      subjectId: {
        field: 'subjectid',
        type: DataTypes.STRING,
      },
      password: {
        type: new DataTypes.VIRTUAL(DataTypes.STRING),
      },
      hashedPassword: {
        field: 'hashedpassword',
        type: DataTypes.STRING,
      },
      ssoData: {
        field: 'ssodata',
        type: DataTypes.JSONB,
      },
      isOperationalUser: {
        field: 'operationaluserindicator',
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isAdminUser: {
        field: 'administrativeuserindicator',
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isSuperUser: {
        field: 'superuserindicator',
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        field: 'recordcreatetimestamp',
        type: DataTypes.DATE,
      },
      createdById: {
        field: 'recordcreateuser_uuid',
        type: DataTypes.UUID,
      },
      updatedAt: {
        field: 'recordupdatetimestamp',
        type: DataTypes.DATE,
      },
      updatedById: {
        field: 'recordupdateuser_uuid',
        type: DataTypes.UUID,
      },
    },
    {
      sequelize,
      timestamps: true,
      tableName: 'batsuser',
      modelName: 'User',
    }
  );

  User.beforeSave(async (user) => {
    /// if a new password has been set, hash for storage
    if (user.password) {
      user.hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
    }
  });

  return User;
};
