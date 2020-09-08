'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Patientdelivery extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Patientdelivery.belongsTo(models.Patient);
      Patientdelivery.hasMany(models.Ambulance);
      Patientdelivery.hasMany(models.Hospital);
    }
  };
  Patientdelivery.init({
    patientdelivery_uuid: {
      field: "patientdelivery",
      type: DataTypes.UUID,
      primaryKey: true,
      autoIncrement: true,
    },
    ambulance_uuid: {
      field: "ambulance_uuid",
      type: DataTypes.UUID,
      unique: true,
      allowNull: false,
    },
    patient_uuid: {
      field: "patient_uuid",
      type: DataTypes.UUID,
      unique: true,
      allowNull: false,
    },
    hospital_uuid: {
      field: "hospital_uuid",
      type: DataTypes.UUID,
      unique: true,
      allowNull: false,
    },
    deliverystatus: {
      field: "deliverystatus",
      type: DataTypes.UUID,
      unique: true,
      allowNull: false,
    },
    departuredatetime: {
      field: "departuredatetime",
      type: DataTypes.DATE,
      unique: true,
      allowNull: false,
    },
    estimatedarrivaltime: {
      field: "estimatedarrivaltime",
      type: DataTypes.DATE,
      unique: true,
      allowNull: false,
    },
    arrivaldatetime: {
      field: "arrivaldatetime",
      type: DataTypes.DATE,
      unique: true,
      allowNull: false,
    },
    admissiondatetime: {
      field: "admissiondatetime",
      type: DataTypes.DATE,
      unique: true,
      allowNull: false,
    },
    recordcreatetimestamp: {
      field: "recordcreatetimestamp",
      type: DataTypes.DATE,
      unique: true,
      allowNull: false,
    },
    recordcreatesource: {
      field: "recordcreatesource",
      type: DataTypes.TEXT,
      unique: true,
      allowNull: false,
    },
    recordupdatetimestamp: {
      field: "patient",
      type: DataTypes.DATE,
      unique: true,
      allowNull: false,
    },
    recordupdatesource: {
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