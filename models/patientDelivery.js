const _ = require('lodash');
const { Model } = require('sequelize');
const { DeliveryStatus } = require('../src/constants');
const patientDeliveryMeta = require('../src/metadata/patientDelivery');
const convertToSequelizeField = require('../src/metadata/convertToSequelizeField');

module.exports = (sequelize) => {
  class PatientDelivery extends Model {
    static get Status() {
      return DeliveryStatus;
    }

    static associate(models) {
      PatientDelivery.belongsTo(models.Patient);
      PatientDelivery.belongsTo(models.Ambulance);
      PatientDelivery.belongsTo(models.Hospital);
      PatientDelivery.belongsTo(models.User, { as: 'ParamedicUser' });
      PatientDelivery.belongsTo(models.User, { as: 'CreatedBy' });
      PatientDelivery.belongsTo(models.User, { as: 'UpdatedBy' });
      PatientDelivery.hasMany(models.PatientDeliveryUpdate);
    }

    static async createRingdown(ambulanceId, patientId, hospitalId, paramedicId, dateTimeLocal, etaMinutes, options) {
      const patientDelivery = await PatientDelivery.create(
        {
          AmbulanceId: ambulanceId,
          PatientId: patientId,
          HospitalId: hospitalId,
          ParamedicUserId: paramedicId,
          currentDeliveryStatus: DeliveryStatus.RINGDOWN_SENT,
          currentDeliveryStatusDateTimeLocal: dateTimeLocal,
          etaMinutes,
          CreatedById: paramedicId,
          UpdatedById: paramedicId,
        },
        options
      );
      await sequelize.models.PatientDeliveryUpdate.create(
        {
          PatientDeliveryId: patientDelivery.id,
          deliveryStatus: DeliveryStatus.RINGDOWN_SENT,
          deliveryStatusDateTimeLocal: dateTimeLocal,
          CreatedById: paramedicId,
          UpdatedById: paramedicId,
        },
        options
      );
      return patientDelivery;
    }

    async createDeliveryStatusUpdate(userId, deliveryStatus, dateTimeLocal, options) {
      // if we're already in the specified state, just return
      if (this.currentDeliveryStatus === deliveryStatus) {
        return sequelize.models.PatientDeliveryUpdate.findOne({
          where: {
            PatientDeliveryId: this.id,
            deliveryStatus,
          },
          transaction: options?.transaction,
        });
      }
      // otherwise, check for a valid state transition
      switch (deliveryStatus) {
        case DeliveryStatus.RINGDOWN_RECEIVED:
        // fallthrough
        case DeliveryStatus.RINGDOWN_CONFIRMED:
          // ER can receive/confirm at any time
          break;
        case DeliveryStatus.ARRIVED:
          if (
            this.currentDeliveryStatus === DeliveryStatus.RINGDOWN_SENT ||
            this.currentDeliveryStatus === DeliveryStatus.RINGDOWN_RECEIVED ||
            this.currentDeliveryStatus === DeliveryStatus.RINGDOWN_CONFIRMED
          ) {
            break;
          }
          throw new Error();
        case DeliveryStatus.OFFLOADED:
          if (this.currentDeliveryStatus === DeliveryStatus.ARRIVED) {
            break;
          }
          throw new Error();
        case DeliveryStatus.OFFLOADED_ACKNOWLEDGED:
          if (this.currentDeliveryStatus === DeliveryStatus.OFFLOADED) {
            break;
          }
          throw new Error();
        case DeliveryStatus.RETURNED_TO_SERVICE:
          if (
            this.currentDeliveryStatus === DeliveryStatus.OFFLOADED ||
            this.currentDeliveryStatus === DeliveryStatus.OFFLOADED_ACKNOWLEDGED
          ) {
            break;
          }
          throw new Error();
        case DeliveryStatus.CANCEL_ACKNOWLEDGED:
          if (this.currentDeliveryStatus === DeliveryStatus.CANCELLED) {
            break;
          }
          throw new Error();
        case DeliveryStatus.REDIRECTED:
          if (
            this.currentDeliveryStatus === DeliveryStatus.RINGDOWN_SENT ||
            this.currentDeliveryStatus === DeliveryStatus.RINGDOWN_RECEIVED ||
            this.currentDeliveryStatus === DeliveryStatus.RINGDOWN_CONFIRMED ||
            this.currentDeliveryStatus === DeliveryStatus.ARRIVED
          ) {
            break;
          }
          throw new Error();
        case DeliveryStatus.REDIRECT_ACKNOWLEDGED:
          if (this.currentDeliveryStatus === DeliveryStatus.REDIRECTED) {
            break;
          }
          throw new Error();
        default:
          // fallthrough...
          break;
      }
      const [patientDeliveryUpdate, isCreated] = await sequelize.models.PatientDeliveryUpdate.findOrCreate({
        where: {
          PatientDeliveryId: this.id,
          deliveryStatus,
        },
        defaults: {
          deliveryStatusDateTimeLocal: dateTimeLocal,
          CreatedById: userId,
          UpdatedById: userId,
        },
        transaction: options?.transaction,
      });
      let updateCurrentDeliveryStatus = isCreated;
      if (deliveryStatus === DeliveryStatus.RINGDOWN_RECEIVED && this.currentDeliveryStatus !== DeliveryStatus.RINGDOWN_SENT) {
        updateCurrentDeliveryStatus = false;
      } else if (deliveryStatus === DeliveryStatus.RINGDOWN_CONFIRMED && this.currentDeliveryStatus !== DeliveryStatus.RINGDOWN_RECEIVED) {
        updateCurrentDeliveryStatus = false;
      }
      if (updateCurrentDeliveryStatus) {
        this.currentDeliveryStatus = deliveryStatus;
        this.currentDeliveryStatusDateTimeLocal = dateTimeLocal;
        this.UpdatedById = userId;
        await this.save(options);
      }
      return patientDeliveryUpdate;
    }

    async toRingdownJSON(options) {
      const ambulance = this.Ambulance || (await this.getAmbulance(options));
      const hospital = this.Hospital || (await this.getHospital(options));
      const patient = this.Patient || (await this.getPatient(options));
      const emsCall = patient.EmergencyMedicalServiceCall || (await patient.getEmergencyMedicalServiceCall(options));
      const json = {
        id: this.id,
        ambulance: {
          ambulanceIdentifier: ambulance.ambulanceIdentifier,
        },
        emsCall: {
          dispatchCallNumber: emsCall.dispatchCallNumber,
        },
        hospital: _.pick(hospital, ['id', 'name']),
        patient: _.pick(patient, sequelize.models.Patient.Params),
        patientDelivery: _.pick(this, patientDeliveryMeta.getParams()),
      };
      json.patientDelivery.timestamps = {};
      const patientDeliveryUpdates = this.PatientDeliveryUpdates || (await this.getPatientDeliveryUpdates(options));
      patientDeliveryUpdates.forEach((pdu) => {
        json.patientDelivery.timestamps[pdu.deliveryStatus] = pdu.deliveryStatusDateTimeLocal;
      });
      return json;
    }
  }
  PatientDelivery.init(patientDeliveryMeta.getFieldHash(convertToSequelizeField), {
    sequelize,
    timestamps: true,
    tableName: patientDeliveryMeta.tableName,
    modelName: patientDeliveryMeta.modelName,
  });
  return PatientDelivery;
};
