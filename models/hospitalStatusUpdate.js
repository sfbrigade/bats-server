"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class HospitalStatusUpdate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // TODO
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
      hospitalId: {
        // TODO - add association
        field: "hospital_uuid",
        type: DataTypes.UUID,
        allowNull: false,
      },
      hospitalAdministratorId: {
        // TODO - add association
        field: "hospitaladministrator_uuid",
        type: DataTypes.UUID,
        allowNull: false,
      },
      updateDatetime: {
        field: "updatedatetime",
        type: Sequelize.DATE,
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
