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
      Organization.hasMany(models.Assignment, { foreignKey: 'FromOrganizationId' });
      Organization.hasMany(models.Assignment, { as: 'Assignees', foreignKey: 'ToOrganizationId' });
      Organization.belongsTo(models.User, { as: 'CreatedBy' });
      Organization.belongsTo(models.User, { as: 'UpdatedBy' });
    }

    toJSON() {
      const attributes = { ...this.get() };
      attributes.hospitals = this.Hospitals?.map((h) => h.toJSON());
      return _.pick(attributes, ['id', 'name', 'type', 'state', 'stateUniqueId', 'timeZone', 'isActive', 'hospitals', 'isMfaEnabled']);
    }
  }

  initModel(Organization, metadata, sequelize);

  return Organization;
};
