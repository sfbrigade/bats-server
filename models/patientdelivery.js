'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PatientDelivery extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Patientdelivery.belongsTo(models.Patient);
      // Patientdelivery.hasMany(models.Ambulance);
      // Patientdelivery.hasMany(models.Hospital);
    }
  }
  PatientDelivery.init({
    Id: {
      field: "patientdelivery",
      type: DataTypes.UUID,
      primaryKey: true,
      autoIncrement: true,
    },
    Ambulance_uuid: {
      field: "ambulance_uuid",
      type: DataTypes.UUID,
      unique: true,
      allowNull: false,
    },
    Patient_uuid: {
      field: "patient_uuid",
      type: DataTypes.UUID,
      unique: true,
      allowNull: false,
    },
    Hospital_uuid: {
      field: "hospital_uuid",
      type: DataTypes.UUID,
      unique: true,
      allowNull: false,
    },
    DeliveryStatus: {
      field: "deliverystatus",
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    DepartureDateTime: {
      field: "departuredatetime",
      type: DataTypes.DATE,
      unique: true,
      allowNull: false,
    },
    EstimatedArrivalTime: {
      field: "estimatedarrivaltime",
      type: DataTypes.DATE,
      unique: true,
      allowNull: false,
    },
    ArrivalDateTime: {
      field: "arrivaldatetime",
      type: DataTypes.DATE,
      unique: true,
      allowNull: false,
    },
    AdmissionDateTime: {
      field: "admissiondatetime",
      type: DataTypes.DATE,
      unique: true,
      allowNull: false,
    },
    RecordCreateTimestamp: {
      field: "recordcreatetimestamp",
      type: DataTypes.DATE,
      unique: true,
      allowNull: false,
    },
    RecordCreateSource: {
      field: "recordcreatesource",
      type: DataTypes.TEXT,
      unique: true,
      allowNull: false,
    },
    RecordUpdateTimestamp: {
      field: "patient",
      type: DataTypes.DATE,
      unique: true,
      allowNull: false,
    },
    RecordUpdateSource: {
      field: "patient",
      type: DataTypes.DATE,
      unique: true,
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: true,
    createdAt: "recordCreateTimestamp",
    updatedAt: "recordUpdateTimestamp",
    tableName: "patientdelivery",
    modelName: 'Patientdelivery',
  });
  return Patientdelivery;
};