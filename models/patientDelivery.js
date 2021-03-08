const _ = require('lodash');
const { Model } = require('sequelize');

const DeliveryStatus = {
  RINGDOWN_SENT: 'RINGDOWN SENT',
  RINGDOWN_RECEIVED: 'RINGDOWN RECEIVED',
  ARRIVED: 'ARRIVED',
  OFFLOADED: 'OFFLOADED',
  RETURNED_TO_SERVICE: 'RETURNED TO SERVICE',
};
Object.freeze(DeliveryStatus);

const PatientDeliveryParams = [
  'deliveryStatus',
  'etaMinutes',
  'ringdownSentDateTimeLocal',
  'ringdownReceivedDateTimeLocal',
  'arrivedDateTimeLocal',
  'offloadedDateTimeLocal',
  'returnToServiceDateTimeLocal',
];
Object.freeze(PatientDeliveryParams);

module.exports = (sequelize, DataTypes) => {
  class PatientDelivery extends Model {
    static get Params() {
      return PatientDeliveryParams;
    }

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
    }

    setDeliveryStatus(deliveryStatus, dateTimeLocal) {
      // if we're already in the specified state, just return
      if (this.deliveryStatus === deliveryStatus) {
        return;
      }
      // otherwise, check for a valid state transition
      switch (deliveryStatus) {
        case DeliveryStatus.RINGDOWN_RECEIVED:
          if (this.deliveryStatus === DeliveryStatus.RINGDOWN_SENT) {
            this.deliveryStatus = deliveryStatus;
            this.ringdownReceivedDateTimeLocal = dateTimeLocal;
            return;
          }
          break;
        case DeliveryStatus.ARRIVED:
          if (this.deliveryStatus === DeliveryStatus.RINGDOWN_SENT || this.deliveryStatus === DeliveryStatus.RINGDOWN_RECEIVED) {
            this.deliveryStatus = deliveryStatus;
            this.arrivedDateTimeLocal = dateTimeLocal;
            return;
          }
          break;
        case DeliveryStatus.OFFLOADED:
          if (this.deliveryStatus === DeliveryStatus.ARRIVED) {
            this.deliveryStatus = deliveryStatus;
            this.offloadedDateTimeLocal = dateTimeLocal;
            return;
          }
          break;
        case DeliveryStatus.RETURNED_TO_SERVICE:
          if (this.deliveryStatus === DeliveryStatus.OFFLOADED) {
            this.deliveryStatus = deliveryStatus;
            this.returnToServiceDateTimeLocal = dateTimeLocal;
            return;
          }
          break;
        default:
          // fallthrough...
          break;
      }
      // otherwise, throw an exception
      throw new Error();
    }

    async toRingdownJSON(options) {
      const ambulance = this.Ambulance || (await this.getAmbulance(options));
      const hospital = this.Hospital || (await this.getHospital(options));
      const patient = this.Patient || (await this.getPatient(options));
      const emsCall = patient.EmergencyMedicalServiceCall || (await patient.getEmergencyMedicalServiceCall(options));
      return {
        id: this.id,
        ambulance: {
          ambulanceIdentifier: ambulance.ambulanceIdentifier,
        },
        emsCall: {
          dispatchCallNumber: emsCall.dispatchCallNumber,
        },
        hospital: _.pick(hospital, ['id', 'name']),
        patient: _.pick(patient, sequelize.models.Patient.Params),
        patientDelivery: _.pick(this, PatientDeliveryParams),
      };
    }
  }
  PatientDelivery.init(
    {
      id: {
        field: 'patientdelivery_uuid',
        type: DataTypes.UUID,
        primaryKey: true,
        autoIncrement: true,
      },
      AmbulanceId: {
        field: 'ambulance_uuid',
        type: DataTypes.UUID,
        allowNull: false,
      },
      PatientId: {
        field: 'patient_uuid',
        type: DataTypes.UUID,
        allowNull: false,
      },
      HospitalId: {
        field: 'hospital_uuid',
        type: DataTypes.UUID,
        allowNull: false,
      },
      ParamedicUserId: {
        field: 'paramedicuser_uuid',
        type: DataTypes.UUID,
        allowNull: false,
      },
      deliveryStatus: {
        field: 'deliverystatusenum',
        type: DataTypes.ENUM('RINGDOWN SENT', 'RINGDOWN RECEIVED', 'ARRIVED', 'OFFLOADED', 'RETURNED TO SERVICE'),
        allowNull: false,
      },
      etaMinutes: {
        field: 'etaminutes',
        type: DataTypes.INTEGER,
      },
      ringdownSentDateTimeLocal: {
        field: 'ringdownsentdatetimelocal',
        type: DataTypes.DATE,
      },
      ringdownReceivedDateTimeLocal: {
        field: 'ringdownreceiveddatetimelocal',
        type: DataTypes.DATE,
      },
      arrivedDateTimeLocal: {
        field: 'arriveddatetimelocal',
        type: DataTypes.DATE,
      },
      offloadedDateTimeLocal: {
        field: 'offloadeddatetimelocal',
        type: DataTypes.DATE,
      },
      returnToServiceDateTimeLocal: {
        field: 'returntoservicedatetimelocal',
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
      tableName: 'patientdelivery',
      modelName: 'PatientDelivery',
    }
  );
  return PatientDelivery;
};
