"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class HospitalAdministrator extends Model {
    static associate(models) {
      HospitalAdministrator.belongsTo(models.Hospital);
      HospitalAdministrator.hasMany(models.HospitalStatusUpdate);
    }
  }
  HospitalAdministrator.init(
    {
      id: {
        field: "hospitaladministrator_uuid",
        type: DataTypes.UUID,
        primaryKey: true,
        autoIncrement: true,
      },
      HospitalId: {
        field: "hospital_uuid",
        type: DataTypes.UUID,
        unique: true,
        allowNull: false,
      },
      hospitalAdministratorIdentifier: {
        field: "hospitaladministratoridentifier",
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      firstName: {
        field: "firstname",
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        field: "lastname",
        type: DataTypes.STRING,
        allowNull: false,
      },
      recordUpdateSource: {
        field: "recordupdatesource",
        type: DataTypes.STRING,
        allowNull: false,
      },
      recordUpdateTimestamp: {
        field: "recordupdatetimestamp",
        type: DataTypes.DATE,
      },
      recordCreateSource: {
        field: "recordcreatesource",
        type: DataTypes.STRING,
        allowNull: false,
      },
      recordCreateTimestamp: {
        field: "recordcreatetimestamp",
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      timestamps: true,
      createdAt: "recordCreateTimestamp",
      updatedAt: "recordUpdateTimestamp",
      tableName: "hospitaladministrator",
      modelName: "HospitalAdministrator",
    }
  );
  return HospitalAdministrator;
};
