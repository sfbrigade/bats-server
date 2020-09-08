"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
        Patient.hasMany(models.Patientdelivery);
    }
  }
  Patient.init(
    {
      id: {
        field: "patient",
        type: DataTypes.UUID,
        primaryKey: true,
        autoIncrement: true,
      },
      emergencyMedicalServiceCallId: {
        field: "emergencymedicalservicecall_uuid",
        type: DataTypes.UUID,
        unique: true,
        allowNull: false,
      },
      patientNumber: {
        field: "patient",
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
      },
      age: {
        field: "age",
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      sex: {
        field: "sex",
        type: DataTypes.STRING,
        allowNull: false,
      },
      stableIndicator: {
        field: "stableindicator",
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      chiefComplaintDescription: {
        field: "chiefcomplaintdescription",
        type: DataTypes.STRING,
        allowNull: false,
      },
      heartRateBpm: {
        field: "heartratebpm",
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      temperature: {
        field: "temperature",
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      systolicBloodPressure: {
        field: "systolicbloodpressure",
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      diastolicBloodPressure: {
        field: "diastolicbloodpressure",
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      respiratoryRate: {
        field: "respiratoryrate",
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      oxygenSaturation: {
        field: "oxygensaturation",
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ivIndicator: {
        field: "ivindicator",
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      combativeBehaviorIndicator: {
        field: "combativebehaviorindicator",
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      otherObservationNotes: {
        field: "otherobservationnotes",
        type: DataTypes.TEXT,
        allowNull: false,
      },
      recordCreateTimestamp: {
        field: "recordcreatetimestamp",
        type: DataTypes.DATE,
        allowNull: false,
      },
      recordCreateSource: {
        field: "recordcreatesource",
        type: DataTypes.STRING,
        allowNull: false,
      },
      recordUpdateTimestamp: {
        field: "recordupdatetimestamp",
        type: DataTypes.DATE,
        allowNull: false,
      },
      recordUpdateSource: {
        field: "recordupdatesource",
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
        timestamps: true,
        createdAt: "recordCreateTimestamp",
        updatedAt: "recordUpdateTimestamp",
        tableName: "patient",
        modelName: "Patient",
    }
  );
  return Patient;
};
