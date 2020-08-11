"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Hospital extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define associations here
      // TODO
    }
  }
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
