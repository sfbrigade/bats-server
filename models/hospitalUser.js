const _ = require('lodash');
const { Model } = require('sequelize');
const metadata = require('../src/shared/metadata/hospitalUser');
const convertToSequelizeField = require('../src/shared/metadata/convertToSequelizeField');

module.exports = (sequelize) => {
  class HospitalUser extends Model {
    static associate(models) {
      HospitalUser.belongsTo(models.Hospital);
      HospitalUser.belongsTo(models.User, { as: 'EdAdminUser' });

      HospitalUser.belongsTo(models.User, { as: 'CreatedBy' });
      HospitalUser.belongsTo(models.User, { as: 'UpdatedBy' });
    }

    toJSON() {
      const attributes = { ...this.get() };
      attributes.hospital = this.Hospital?.toJSON() || { id: this.HospitalId };
      return _.pick(attributes, ['hospital', 'isActive', 'isInfoUser', 'isRingdownUser']);
    }
  }

  HospitalUser.init(metadata.getFieldHash(convertToSequelizeField), {
    sequelize,
    timestamps: true,
    tableName: metadata.tableName,
    modelName: metadata.modelName,
  });

  HospitalUser.addScope('active', {
    where: { isActive: true },
  });

  return HospitalUser;
};
