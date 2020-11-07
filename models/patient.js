const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    static associate(models) {
      Patient.belongsTo(models.EmergencyMedicalServiceCall);
      Patient.hasOne(models.PatientDelivery);

      Patient.belongsTo(models.User, { as: 'CreatedBy' });
      Patient.belongsTo(models.User, { as: 'UpdatedBy' });
    }
  }
  Patient.init(
    {
      id: {
        field: 'patient_uuid',
        type: DataTypes.UUID,
        primaryKey: true,
        autoIncrement: true,
      },
      EmergencyMedicalServiceCallId: {
        field: 'emergencymedicalservicecall_uuid',
        type: DataTypes.UUID,
        unique: true,
        allowNull: false,
      },
      age: {
        field: 'age',
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      sex: {
        field: 'sex',
        type: DataTypes.STRING, // TODO - make an enum?
        allowNull: true,
      },
      emergencyServiceResponseType: {
        field: 'emergencyserviceresponsetypeenum',
        type: DataTypes.ENUM('CODE 2', 'CODE 3'),
      },
      chiefComplaintDescription: {
        field: 'chiefcomplaintdescription',
        type: DataTypes.TEXT,
        allowNull: true,
      },
      stableIndicator: {
        field: 'stableindicator',
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      systolicBloodPressure: {
        field: 'systolicbloodpressure',
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      diastolicBloodPressure: {
        field: 'diastolicbloodpressure',
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      heartRateBpm: {
        field: 'heartratebpm',
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      respiratoryRate: {
        field: 'respiratoryrate',
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      oxygenSaturation: {
        field: 'oxygensaturation',
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      lowOxygenResponseType: {
        field: 'lowoxygenresponsetypeenum',
        type: DataTypes.ENUM('ROOM AIR', 'SUPPLEMENTAL OXYGEN'),
      },
      temperature: {
        field: 'temperature',
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      etohSuspectedIndicator: {
        field: 'etohsuspectedindicator',
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      drugsSuspectedIndicator: {
        field: 'drugssuspectedindicator',
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      psychIndicator: {
        field: 'psychindicator',
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      combativeBehaviorIndicator: {
        field: 'combativebehaviorindicator',
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      restraintIndicator: {
        field: 'restraintindicator',
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      // covid19Indicator: {
      //   field: 'covid19indicator',
      //   type: DataTypes.BOOLEAN,
      //   allowNull: true,
      // },
      ivIndicator: {
        field: 'ivindicator',
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      otherObservationNotes: {
        field: 'otherobservationnotes',
        type: DataTypes.TEXT,
        allowNull: true,
      },
      createdAt: {
        field: 'recordcreatetimestamp',
        type: DataTypes.DATE,
      },
      CreatedById: {
        field: 'recordcreateuser_uuid',
        type: DataTypes.UUID,
      },
      updatedAt: {
        field: 'recordupdatetimestamp',
        type: DataTypes.DATE,
      },
      UpdatedById: {
        field: 'recordupdateuser_uuid',
        type: DataTypes.UUID,
      },
    },
    {
      sequelize,
      timestamps: true,
      tableName: 'patient',
      modelName: 'Patient',
    }
  );
  return Patient;
};
