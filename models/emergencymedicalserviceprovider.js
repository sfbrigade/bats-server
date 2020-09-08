'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EmergencyMedicalServiceProvider extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      EmergencyMedicalServiceProvider.hasMany(models.Ambulance);
    }
  }
  EmergencyMedicalServiceProvider.init({
    id: {
      field: "emergencymedicalserviceprovider_uuid",
      type: DataTypes.UUID,
      primaryKey: true,
      autoIncrement: true,
    },
    emergencymedicalserviceprovidername: {
      field: "emergencymedicalserviceprovidername",
      type: DataTypes.TEXT,
      primaryKey: true,
      allowNull: true
    },
    recordcreatetimestamp: {
      field: "recordcreatetimestamp",
      type: DataTypes.DATE,
    },
    recordcreatesource: {
      field: "patient",
      type: DataTypes.TEXT,
    },
    recordupdatetimestamp: {
      field: "recordupdatetimestamp",
      type: DataTypes.DATE,
    },
    recordupdatesource: {
      field: "patient",
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    timestamps: true,
    createdAt: "recordCreateTimestamp",
    updatedAt: "recordUpdateTimestamp",
    tableName: "emergencymedicalserviceprovider",
    modelName: 'EmergencyMedicalServiceProvider',
  });
  return EmergencyMedicalServiceProvider;
};