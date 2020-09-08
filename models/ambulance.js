'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ambulance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Ambulance.hasMany(models.Patientdelivery);
    }
  };
  Ambulance.init({
    ambulance_uuid: {
      field: "ambulance",
      type: DataTypes.UUID,
      primaryKey: true,
      autoIncrement: true,
    },
    emergencymedicalserviceprovider_uuid: {
      field: "emergencymedicalserviceprovider_uuid",
      type: DataTypes.UUID,
      primaryKey: true,
      autoIncrement: true,
    },
    ambulanceidentifier: {
      field: "ambulanceidentifier",
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    recordcreatetimestamp: {
      field: "recordcreatetimestamp",
      type: DataTypes.DATE,
      allowNull: false,
    },
    recordcreatesource: {
      field: "recordcreatesource",
      type: DataTypes.STRING,
      allowNull: false,
    },
    recordupdatetimestamp: {
      field: "recordupdatetimestamp",
      type: DataTypes.DATE,
      allowNull: false,
    },
    recordupdatesource: {
      field: "recordupdatesource",
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: true,
    createdAt: "recordCreateTimestamp",
    updatedAt: "recordUpdateTimestamp",
    tableName: "ambulance",
    modelName: 'Ambulance',
  });
  return Ambulance;
};