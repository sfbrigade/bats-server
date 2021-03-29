const _ = require('lodash');
const { Model, Op } = require('sequelize');
const { DeliveryStatus } = require('../constants');

module.exports = (sequelize, DataTypes) => {
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
          [Op.and]: [
            {
              currentDeliveryStatus: { [Op.ne]: DeliveryStatus.OFFLOADED },
            },
            {
              currentDeliveryStatus: { [Op.ne]: DeliveryStatus.RETURNED_TO_SERVICE },
            },
          ],
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
          delivery.currentDeliveryStatus === DeliveryStatus.RINGDOWN_RECEIVED
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
      json.hospital = _.pick(hospital, ['id', 'name']);
      const ambulanceCounts = hospital.ambulanceCounts || (await hospital.getAmbulanceCounts(options));
      json.hospital.ambulancesEnRoute = ambulanceCounts.enRoute;
      json.hospital.ambulancesOffloading = ambulanceCounts.offloading;
      return json;
    }
  }
  HospitalStatusUpdate.init(
    {
      id: {
        field: 'hospitalstatusupdate_uuid',
        type: DataTypes.UUID,
        primaryKey: true,
        autoIncrement: true,
      },
      HospitalId: {
        field: 'hospital_uuid',
        type: DataTypes.UUID,
        unique: true,
        allowNull: false,
      },
      EdAdminUserId: {
        field: 'edadminuser_uuid',
        type: DataTypes.UUID,
        unique: true,
        allowNull: false,
      },
      updateDateTimeLocal: {
        field: 'updatedatetimelocal',
        type: DataTypes.DATE,
        unique: true,
        allowNull: false,
      },
      openEdBedCount: {
        field: 'openedbedcount',
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      openPsychBedCount: {
        field: 'openpsychbedcount',
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bedCountUpdateDateTimeLocal: {
        field: 'bedcountupdatedatetimelocal',
        type: DataTypes.DATE,
      },
      divertStatusIndicator: {
        field: 'divertstatusindicator',
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      divertStatusUpdateDateTimeLocal: {
        field: 'divertstatusupdatedatetimelocal',
        type: DataTypes.DATE,
      },
      additionalServiceAvailabilityNotes: {
        field: 'additionalserviceavailabilitynotes',
        type: DataTypes.TEXT,
        allowNull: true,
      },
      notesUpdateDateTimeLocal: {
        field: 'notesupdatedatetimelocal',
        type: DataTypes.DATE,
      },
      createdAt: {
        field: 'recordcreatetimestamp',
        type: DataTypes.DATE,
      },
      CreatedById: {
        field: 'recordcreateuser_uuid',
        type: DataTypes.UUID,
      },
      updatedAt: {
        field: 'recordupdatetimestamp',
        type: DataTypes.DATE,
      },
      UpdatedById: {
        field: 'recordupdateuser_uuid',
        type: DataTypes.UUID,
      },
    },
    {
      sequelize,
      timestamps: true,
      tableName: 'hospitalstatusupdate',
      modelName: 'HospitalStatusUpdate',
    }
  );
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
