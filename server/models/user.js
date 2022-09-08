const bcrypt = require('bcrypt');
const _ = require('lodash');
const { Model } = require('sequelize');
const metadata = require('../../client/src/shared/metadata/user');
const convertToSequelizeField = require('../../client/src/shared/convertToSequelizeField');

const SALT_ROUNDS = 10;

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Organization);
      User.belongsTo(models.User, { as: 'CreatedBy' });
      User.belongsTo(models.User, { as: 'UpdatedBy' });
      User.hasMany(models.HospitalUser, { foreignKey: 'edadminuser_uuid' });
      User.hasMany(models.HospitalUser.scope('active'), {
        as: 'ActiveHospitalUsers',
        foreignKey: 'edadminuser_uuid',
      });
    }

    toJSON() {
      const attributes = { ...this.get() };
      attributes.organization = this.Organization?.toJSON() || { id: this.OrganizationId };
      if (this.ActiveHospitalUsers) {
        attributes.activeHospitals = this.ActiveHospitalUsers.map((h) => h.toJSON());
      }
      return _.pick(attributes, [
        'id',
        'firstName',
        'lastName',
        'email',
        'isActive',
        'isAdminUser',
        'isOperationalUser',
        'isSuperUser',
        'organization',
        'activeHospitals',
      ]);
    }
  }

  User.init(metadata.getFieldHash(convertToSequelizeField), {
    sequelize,
    timestamps: true,
    tableName: metadata.tableName,
    modelName: metadata.modelName,
  });

  User.beforeSave(async (user) => {
    /// if a new password has been set, hash for storage
    if (user.password) {
      user.hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
    }
  });

  return User;
}
