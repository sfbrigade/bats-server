const _ = require('lodash');
const { Model } = require('sequelize');
const metadata = require('shared/metadata/hospitalInvite');
const initModel = require('../metadata/initModel');

module.exports = (sequelize) => {
  class HospitalInvite extends Model {
    static associate(models) {
      HospitalInvite.belongsTo(models.Hospital);
      HospitalInvite.belongsTo(models.Invite);
      HospitalInvite.belongsTo(models.User, { as: 'CreatedBy' });
      HospitalInvite.belongsTo(models.User, { as: 'UpdatedBy' });
    }

    toJSON() {
      const attributes = { ...this.get() };
      attributes.hospital = this.Hospital?.toJSON() || { id: this.HospitalId };
      attributes.invite = this.Invite?.toJSON() || { id: this.InviteId };
      return _.pick(attributes, ['id', 'hospital', 'invite', 'isActive', 'isInfoUser', 'isRingdownUser']);
    }
  }

  initModel(HospitalInvite, metadata, sequelize);

  return HospitalInvite;
};
