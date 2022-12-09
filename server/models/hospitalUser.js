const _ = require('lodash');
const { Model } = require('sequelize');
const metadata = require('../../shared/metadata/hospitalUser');
const initModel = require('../metadata/initModel');

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

  initModel(HospitalUser, metadata, sequelize);

  HospitalUser.addScope('active', {
    where: { isActive: true },
  });

  return HospitalUser;
};
