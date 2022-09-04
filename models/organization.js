const _ = require('lodash');
const { Model } = require('sequelize');
const metadata = require('../src/shared/metadata/organization');
const convertToSequelizeField = require('../src/shared/metadata/convertToSequelizeField');

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
      return _.pick(attributes, ['id', 'name', 'type', 'timeZoneIsoCode', 'isActive', 'hospitals']);
    }
  }
  Organization.init(metadata.getFieldHash(convertToSequelizeField), {
    sequelize,
    timestamps: true,
    tableName: metadata.tableName,
    modelName: metadata.modelName,
  });
  return Organization;
};
