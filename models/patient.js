'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Patient.init({
    patient_uuid: DataTypes.UUID,
    patientnumber: DataTypes.INTEGER,
    age: DataTypes.SMALLINT,
    sex: DataTypes.TEXT,
    stableindicator: DataTypes.BOOLEAN,
    chiefcomplaintdescription: DataTypes.STRING,
    heartratebpm: DataTypes.INTEGER,
    temperature: DataTypes.INTEGER,
    systolicbloodpressure: DataTypes.INTEGER,
    diastolicbloodpressure: DataTypes.INTEGER,
    respiratoryrate: DataTypes.SMALLINT,
    oxygensaturation: DataTypes.SMALLINT,
    ivindicator: DataTypes.SMALLINT,
    combativebehaviorindicator: DataTypes.BOOLEAN,
    otherobservationnotes: DataTypes.TEXT,
    emergencymedicalservicecall_uuid: DataTypes.UUID,
    recordcreatetimestamp: DataTypes.DATE,
    recordcreatesource: DataTypes.TEXT,
    recordupdatetimestamp: DataTypes.DATE,
    recordupdatesource: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Patient',
  });
  return Patient;
};