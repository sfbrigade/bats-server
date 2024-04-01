const _ = require('lodash');
const { Model, Op } = require('sequelize');
const { DeliveryStatus } = require('shared/constants');
const metadata = require('shared/metadata/hospitalStatusUpdate');
const initModel = require('../metadata/initModel');

module.exports = (sequelize) => {
  class HospitalStatusUpdate extends Model {
    static associate(models) {
      HospitalStatusUpdate.belongsTo(models.Hospital);
      HospitalStatusUpdate.belongsTo(models.User, { as: 'EdAdminUser' });

      HospitalStatusUpdate.belongsTo(models.User, { as: 'CreatedBy' });
      HospitalStatusUpdate.belongsTo(models.User, { as: 'UpdatedBy' });
    }

    static async getLatestUpdatesWithAmbulanceCounts(options) {
      // NOTE: processing the ambulances enroute and offloading in memory here because it was easier
      // than figuring it out in Sequelize. We can probably use a raw SQL query if this ever becomes
      // a performance issue.
      const activeDeliveries = await sequelize.models.PatientDelivery.findAll({
        include: [sequelize.models.Hospital],
        where: {
          currentDeliveryStatus: {
            [Op.lt]: DeliveryStatus.OFFLOADED,
          },
        },
        transaction: options?.transaction,
      });

      const ambulanceCountsByHospitalId = activeDeliveries.reduce((accumulator, delivery) => {
        const ambulanceCounts = {
          enRoute: _.get(accumulator, `${delivery.HospitalId}.enRoute`, 0),
          offloading: _.get(accumulator, `${delivery.HospitalId}.offloading`, 0),
        };
        if (
          delivery.currentDeliveryStatus === DeliveryStatus.RINGDOWN_SENT ||
          delivery.currentDeliveryStatus === DeliveryStatus.RINGDOWN_RECEIVED ||
          delivery.currentDeliveryStatus === DeliveryStatus.RINGDOWN_CONFIRMED
        ) {
          ambulanceCounts.enRoute += 1;
        } else if (delivery.currentDeliveryStatus === DeliveryStatus.ARRIVED) {
          ambulanceCounts.offloading += 1;
        }
        accumulator[delivery.HospitalId] = ambulanceCounts;
        return accumulator;
      }, {});

      const statusUpdates = await HospitalStatusUpdate.scope('latest').findAll({
        include: [sequelize.models.Hospital],
        transaction: options?.transaction,
      });
      statusUpdates.sort((a, b) => a.Hospital.sortSequenceNumber - b.Hospital.sortSequenceNumber);
      statusUpdates.forEach((statusUpdate) => {
        statusUpdate.Hospital.ambulanceCounts = ambulanceCountsByHospitalId[statusUpdate.HospitalId] || { enRoute: 0, offloading: 0 };
      });
      return statusUpdates;
    }

    async toJSON(options) {
      const json = _.pick(this, [
        'id',
        'mciRedCapacity',
        'mciYellowCapacity',
        'mciGreenCapacity',
        'openEdBedCount',
        'openPsychBedCount',
        'bedCountUpdateDateTimeLocal',
        'divertStatusIndicator',
        'divertStatusUpdateDateTimeLocal',
        'additionalServiceAvailabilityNotes',
        'notesUpdateDateTimeLocal',
        'updateDateTimeLocal',
      ]);
      json.edAdminUserId = this.EdAdminUserId;
      json.createdById = this.CreatedById;
      json.updatedById = this.UpdatedById;
      const hospital = this.Hospital || (await this.getHospital(options));
      json.hospital = _.pick(hospital, ['id', 'name', 'state', 'stateFacilityCode', 'sortSequenceNumber']);
      const ambulanceCounts = hospital.ambulanceCounts || (await hospital.getAmbulanceCounts(options));
      json.hospital.ambulancesEnRoute = ambulanceCounts.enRoute;
      json.hospital.ambulancesOffloading = ambulanceCounts.offloading;
      return json;
    }
  }

  initModel(HospitalStatusUpdate, metadata, sequelize);

  HospitalStatusUpdate.addScope('latest', () => ({
    attributes: [sequelize.literal('DISTINCT ON("HospitalStatusUpdate".hospital_uuid) 1')].concat(
      Object.keys(HospitalStatusUpdate.rawAttributes)
    ),
    order: [
      ['HospitalId', 'ASC'],
      ['updateDateTimeLocal', 'DESC'],
    ],
  }));

  return HospitalStatusUpdate;
};
