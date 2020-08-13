"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class HospitalStatusUpdate extends Model {
    static associate(models) {
      HospitalStatusUpdate.belongsTo(Model.Hospital);
      HospitalStatusUpdate.belongsTo(Model.hospitalAdministratorId);
    }
  }
  HospitalStatusUpdate.init(
    {
      id: {
        field: "hospitalstatusupdate_uuid",
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      updateDatetime: {
        field: "updatedatetime",
        type: Sequelize.DATE,
        unique: true,
        allowNull: false,
      },
      openedBedCount: {
        field: "openedbedcount",
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      edWaitingRoomCount: {
        field: "edwaitingroomcount",
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      divertStatusIndicator: {
        field: "divertstatusindicator",
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      additionalServiceAvailabilityNotes: {
        field: "additionalserviceavailabilitynotes",
        type: DataTypes.STRING,
        allowNull: true,
      },
      recordUpdateSource: {
        field: "recordupdatesource",
        type: DataTypes.STRING,
        allowNull: false,
      },
      recordCreatedSource: {
        field: "recordcreatedsource",
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: true,
      createdAt: "recordcreatetimestamp",
      updatedAt: "recordupdatetimestamp",
      tableName: "hospitalstatusupdate",
      modelName: "HospitalStatusUpdate",
    }
  );
  return HospitalStatusUpdate;
};
