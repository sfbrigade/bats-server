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
  Patient.init(
      {
        patient_uuid: {
          field: "patient",
          type: DataTypes.UUID,
          primaryKey: true,
          autoIncrement: true,
        },
        patientnumber: {
          field: "patient",
          type: DataTypes.INTEGER,
          unique: true,
          allowNull: false,
        },
        age: {
          field: "age",
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        sex: {
          field: "sex",
          type: DataTypes.STRING,
          allowNull: false,
        },
        stableindicator: {
          field: "stableindicator",
          type: DataTypes.BOOLEAN,
          allowNull: false
        },
        chiefcomplaintdescription: {
          field: "chiefcomplaintdescription",
          type: DataTypes.STRING,
          allowNull: false,
        },
        heartratebpm: {
          field: "heartratebpm",
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        temperature: {
          field: "temperature",
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        systolicbloodpressure: {
          field: "systolicbloodpressure",
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        diastolicbloodpressure: {
          field: "diastolicbloodpressure",
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        respiratoryrate: {
          field: "respiratoryrate",
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        oxygensaturation: {
          field: "oxygensaturation",
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        ivindicator: {
          field: "ivindicator",
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        combativebehaviorindicator: {
          field: "combativebehaviorindicator",
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        otherobservationnotes: {
          field: "otherobservationnotes",
          type: DataTypes.TEXT,
          allowNull: false,
        },
        emergencymedicalservicecall_uuid: {
          field: "emergencymedicalservicecall_uuid",
          type: DataTypes.UUID,
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
          type: DataTypes.TEXT,
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
        }
  }, {
    sequelize,
    modelName: 'Patient',
  });
  return Patient;
};