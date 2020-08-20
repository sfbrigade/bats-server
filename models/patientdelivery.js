'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Patientdelivery extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Patientdelivery.init({
    patientdelivery_uuid: DataTypes.UUID,
    ambulance_uuid: DataTypes.UUID,
    patient_uuid: DataTypes.UUID,
    hospital_uuid: DataTypes.UUID,
    deliverystatus: DataTypes.TEXT,
    departuredatetime: DataTypes.DATE,
    estimatedarrivaltime: DataTypes.DATE,
    arrivaldatetime: DataTypes.DATE,
    admissiondatetime: DataTypes.DATE,
    recordcreatetimestamp: DataTypes.DATE,
    recordcreatesource: DataTypes.TEXT,
    recordupdatetimestamp: DataTypes.DATE,
    recordupdatesource: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Patientdelivery',
  });
  return Patientdelivery;
};