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
      // Patientdelivery.hasMany(models.Ambulance);
      // Patientdelivery.hasMany(models.Hospital);
    }
  }
  PatientDelivery.init(
    {
      id: {
        field: 'patientdelivery',
        type: DataTypes.UUID,
        primaryKey: true,
        autoIncrement: true,
      },
      AmbulanceId: {
        field: 'ambulance_uuid',
        type: DataTypes.UUID,
        unique: true,
        allowNull: false,
      },
      PatientId: {
        field: 'patient_uuid',
        type: DataTypes.UUID,
        unique: true,
        allowNull: false,
      },
      HospitalId: {
        field: 'hospital_uuid',
        type: DataTypes.UUID,
        unique: true,
        allowNull: false,
      },
      deliveryStatus: {
        field: 'deliverystatus',
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      departureDateTime: {
        field: 'departuredatetime',
        type: DataTypes.DATE,
        unique: true,
        allowNull: false,
      },
      estimatedArrivalTime: {
        field: 'estimatedarrivaltime',
        type: DataTypes.DATE,
        unique: true,
        allowNull: false,
      },
      arrivalDateTime: {
        field: 'arrivaldatetime',
        type: DataTypes.DATE,
        unique: true,
        allowNull: false,
      },
      admissionDateTime: {
        field: 'admissiondatetime',
        type: DataTypes.DATE,
        unique: true,
        allowNull: false,
      },
      recordCreateTimestamp: {
        field: 'recordcreatetimestamp',
        type: DataTypes.DATE,
        unique: true,
        allowNull: false,
      },
      recordCreateSource: {
        field: 'recordcreatesource',
        type: DataTypes.TEXT,
        unique: true,
        allowNull: false,
      },
      recordUpdateTimestamp: {
        field: 'patient',
        type: DataTypes.DATE,
        unique: true,
        allowNull: false,
      },
      recordUpdateSource: {
        field: 'patient',
        type: DataTypes.DATE,
        unique: true,
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: true,
      createdAt: 'recordCreateTimestamp',
      updatedAt: 'recordUpdateTimestamp',
      tableName: 'patientdelivery',
      modelName: 'Patientdelivery',
    }
  );
  return PatientDelivery;
};
