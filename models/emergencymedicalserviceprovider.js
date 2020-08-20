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
    }
  };
  EmergencyMedicalServiceProvider.init({
    emergencymedicalserviceprovider_uuid: DataTypes.UUID,
    emergencymedicalserviceprovidername: DataTypes.TEXT,
    recordcreatetimestamp: DataTypes.DATE,
    recordcreatesource: DataTypes.TEXT,
    recordupdatetimestamp: DataTypes.DATE,
    recordupdatesource: DataTypes.CHAR
  }, {
    sequelize,
    modelName: 'EmergencyMedicalServiceProvider',
  });
  return EmergencyMedicalServiceProvider;
};