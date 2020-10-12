const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PatientDelivery extends Model {
    static associate(models) {
      PatientDelivery.belongsTo(models.Patient, { as: 'patient' });
      PatientDelivery.belongsTo(models.Ambulance, { as: 'ambulance' });
      PatientDelivery.belongsTo(models.Hospital, { as: 'hospital' });
      PatientDelivery.belongsTo(models.User, { as: 'paramedicUser' });

      PatientDelivery.belongsTo(models.User, { as: 'createdBy' });
      PatientDelivery.belongsTo(models.User, { as: 'updatedBy' });
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
      ambulanceId: {
        field: 'ambulance_uuid',
        type: DataTypes.UUID,
        allowNull: false,
      },
      patientId: {
        field: 'patient_uuid',
        type: DataTypes.UUID,
        allowNull: false,
      },
      hospitalId: {
        field: 'hospital_uuid',
        type: DataTypes.UUID,
        allowNull: false,
      },
      paramedicUserId: {
        field: 'paramedicuser_uuid',
        type: DataTypes.UUID,
        allowNull: false,
      },
      deliveryStatus: {
        field: 'deliverystatus', // TODO - make an enum?
        type: DataTypes.STRING,
        allowNull: false,
      },
      departureDateTime: {
        field: 'departuredatetime',
        type: DataTypes.DATE,
        allowNull: true,
      },
      estimatedArrivalTime: {
        field: 'estimatedarrivaltime',
        type: DataTypes.DATE,
        allowNull: true,
      },
      arrivalDateTime: {
        field: 'arrivaldatetime',
        type: DataTypes.DATE,
        allowNull: true,
      },
      admissionDateTime: {
        field: 'admissiondatetime',
        type: DataTypes.DATE,
        allowNull: true,
      },
      createdAt: {
        field: 'recordcreatetimestamp',
        type: DataTypes.DATE,
      },
      createdById: {
        field: 'recordcreateuser_uuid',
        type: DataTypes.UUID,
      },
      updatedAt: {
        field: 'recordupdatetimestamp',
        type: DataTypes.DATE,
      },
      updatedById: {
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
