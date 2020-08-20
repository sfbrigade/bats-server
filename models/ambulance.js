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
    }
  };
  Ambulance.init({
    ambulance_uuid: DataTypes.UUID,
    emergencymedicalserviceprovider_uuid: DataTypes.UUID,
    ambulanceidentifier: DataTypes.TEXT,
    recordcreatetimestamp: DataTypes.DATE,
    recordcreatesource: DataTypes.TEXT,
    recordupdatetimestamp: DataTypes.DATE,
    recordupdatesource: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Ambulance',
  });
  return Ambulance;
};