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
