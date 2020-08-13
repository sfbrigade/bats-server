"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Hospital extends Model {}
  Hospital.init(
    {
      id: {
        field: "hospital_uuid",
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      hospitalName: {
        field: "hospitalname",
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
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
      tableName: "hospital",
      modelName: "Hospital",
    }
  );
  return Hospital;
};
