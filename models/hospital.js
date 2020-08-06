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
      // define association here
    }
  }
  Hospital.init(
    {
      hospital_uuid: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      hospitalname: { type: DataTypes.STRING.BINARY, allowNull: false },
      recordcreatedsource: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      timestamps: true,
      createdAt: "recordcreatetimestamp", // set a custom name for createdAt timestamp
      updatedAt: "recordupdatetimestamp", // set a custom name for updatedAt timestamp
      tableName: "hospital",
      modelName: "hospital",
    }
  );
  return Hospital;
};
