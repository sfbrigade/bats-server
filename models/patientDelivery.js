const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PatientDelivery extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PatientDelivery.belongsTo(models.Patient);
      PatientDelivery.belongsTo(models.Ambulance);
      PatientDelivery.belongsTo(models.Hospital);
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
      recordCreateTimestamp: {
        field: 'recordcreatetimestamp',
        type: DataTypes.DATE,
      },
      recordCreateSource: {
        field: 'recordcreatesource',
        type: DataTypes.STRING,
        allowNull: false,
      },
      recordUpdateTimestamp: {
        field: 'recordupdatetimestamp',
        type: DataTypes.DATE,
      },
      recordUpdateSource: {
        field: 'recordupdatesource',
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: true,
      createdAt: 'recordCreateTimestamp',
      updatedAt: 'recordUpdateTimestamp',
      tableName: 'patientdelivery',
      modelName: 'PatientDelivery',
    }
  );
  return PatientDelivery;
};
