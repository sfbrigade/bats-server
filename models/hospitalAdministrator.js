"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class HospitalAdministrator extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      HospitalAdministrator.belongsTo(models.Hospital);
    }
  }
  HospitalAdministrator.init(
    {
      id: {
        field: "hospitaladministrator_uuid",
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      hospitalId: {
        // TODO - add association
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
      tableName: "hospitaladministrator",
      modelName: "HospitalAdministrator",
    }
  );
  return HospitalAdministrator;
};
