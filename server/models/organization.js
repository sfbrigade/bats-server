const _ = require('lodash');
const { Model } = require('sequelize');
const metadata = require('shared/metadata/organization');
const initModel = require('../metadata/initModel');

module.exports = (sequelize) => {
  class Organization extends Model {
    static associate(models) {
      Organization.hasMany(models.Ambulance);
      Organization.hasMany(models.Hospital);
      Organization.hasMany(models.User);

      Organization.belongsTo(models.User, { as: 'CreatedBy' });
      Organization.belongsTo(models.User, { as: 'UpdatedBy' });
    }

    toJSON() {
      const attributes = { ...this.get() };
      attributes.hospitals = this.Hospitals?.map((h) => h.toJSON());
      return _.pick(attributes, ['id', 'name', 'type', 'timeZoneIsoCode', 'isActive', 'hospitals', 'twoFactorEnabled']);
    }
  }

  initModel(Organization, metadata, sequelize);

  return Organization;
};
