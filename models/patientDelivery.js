const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PatientDelivery extends Model {
    static associate(models) {
      PatientDelivery.belongsTo(models.Patient);
      PatientDelivery.belongsTo(models.Ambulance);
      PatientDelivery.belongsTo(models.Hospital);
      PatientDelivery.belongsTo(models.User, { as: 'ParamedicUser' });

      PatientDelivery.belongsTo(models.User, { as: 'CreatedBy' });
      PatientDelivery.belongsTo(models.User, { as: 'UpdatedBy' });
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
