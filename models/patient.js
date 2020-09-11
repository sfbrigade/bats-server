const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Patient.belongsTo(models.EmergencyMedicalServiceCall);
      Patient.hasOne(models.PatientDelivery);
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
      patientNumber: {
        field: 'patientnumber',
        type: DataTypes.INTEGER,
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
      stableIndicator: {
        field: 'stableindicator',
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      chiefComplaintDescription: {
        field: 'chiefcomplaintdescription',
        type: DataTypes.TEXT,
        allowNull: true,
      },
      heartRateBpm: {
        field: 'heartratebpm',
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      temperature: {
        field: 'temperature',
        type: DataTypes.DECIMAL,
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
      ivIndicator: {
        field: 'ivindicator',
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      combativeBehaviorIndicator: {
        field: 'combativebehaviorindicator',
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      otherObservationNotes: {
        field: 'otherobservationnotes',
        type: DataTypes.TEXT,
        allowNull: true,
      },
      recordCreateTimestamp: {
        field: 'recordcreatetimestamp',
        type: DataTypes.DATE,
      },
      recordCreateSource: {
        field: 'recordcreatesource',
        type: DataTypes.STRING,
        allowNull: false,
      },
      recordUpdateTimestamp: {
        field: 'recordupdatetimestamp',
        type: DataTypes.DATE,
      },
      recordUpdateSource: {
        field: 'recordupdatesource',
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: true,
      createdAt: 'recordCreateTimestamp',
      updatedAt: 'recordUpdateTimestamp',
      tableName: 'patient',
      modelName: 'Patient',
    }
  );
  return Patient;
};
