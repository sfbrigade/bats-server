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
      const ambulanceCountsByHospitalId = {};
      const enroute = await sequelize.models.PatientDelivery.count({
        distinct: true,
        col: 'AmbulanceId',
        where: {
          currentDeliveryStatus: {
            [Op.lt]: DeliveryStatus.ARRIVED,
          },
        },
        group: 'HospitalId',
        attributes: ['HospitalId'],
        transaction: options?.transaction,
      });
      enroute.forEach((result) => {
        ambulanceCountsByHospitalId[result.HospitalId] = { enRoute: result.count, offloading: 0 };
      });
      const offloading = await sequelize.models.PatientDelivery.count({
        distinct: true,
        col: 'AmbulanceId',
        where: {
          currentDeliveryStatus: DeliveryStatus.ARRIVED,
        },
        group: 'HospitalId',
        attributes: ['HospitalId'],
        transaction: options?.transaction,
      });
      offloading.forEach((result) => {
        ambulanceCountsByHospitalId[result.HospitalId] ||= { enRoute: 0 };
        ambulanceCountsByHospitalId[result.HospitalId].offloading = result.count;
      });
      const statusUpdates = await HospitalStatusUpdate.scope('latest').findAll({
        include: [
          {
            model: sequelize.models.Hospital,
            required: true,
            include: [
              {
                model: sequelize.models.Organization,
                where: {
                  type: 'HEALTHCARE',
                },
                required: true,
              },
            ],
          },
        ],
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
        'mciUpdateDateTime',
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
