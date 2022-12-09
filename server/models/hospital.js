const _ = require('lodash');
const { Model } = require('sequelize');
const { DeliveryStatus } = require('../../shared/constants');
const metadata = require('../../shared/metadata/hospital');
const initModel = require('../metadata/initModel');

module.exports = (sequelize) => {
  class Hospital extends Model {
    static associate(models) {
      Hospital.belongsTo(models.Organization);

      Hospital.hasMany(models.HospitalStatusUpdate);
      Hospital.hasMany(models.HospitalUser);
      Hospital.hasMany(models.PatientDelivery);

      Hospital.belongsTo(models.User, { as: 'CreatedBy' });
      Hospital.belongsTo(models.User, { as: 'UpdatedBy' });
    }

    async getAmbulanceCounts(options) {
      const counts = await sequelize.models.PatientDelivery.count({
        where: {
          HospitalId: this.id,
        },
        group: ['currentDeliveryStatus'],
        transaction: options?.transaction,
      });
      const ambulanceCounts = {
        enRoute: 0,
        offloading: 0,
      };
      counts.forEach((count) => {
        if (
          count.currentDeliveryStatus === DeliveryStatus.RINGDOWN_SENT ||
          count.currentDeliveryStatus === DeliveryStatus.RINGDOWN_RECEIVED ||
          count.currentDeliveryStatus === DeliveryStatus.RINGDOWN_CONFIRMED
        ) {
          ambulanceCounts.enRoute += parseInt(count.count, 10);
        } else if (count.currentDeliveryStatus === DeliveryStatus.ARRIVED) {
          ambulanceCounts.offloading += parseInt(count.count, 10);
        }
      });
      this.ambulanceCounts = ambulanceCounts;
      return ambulanceCounts;
    }

    toJSON() {
      const attributes = { ...this.get() };
      return _.pick(attributes, ['id', 'name', 'state', 'stateFacilityCode', 'sortSequenceNumber', 'isActive']);
    }
  }

  initModel(Hospital, metadata, sequelize);

  return Hospital;
};
