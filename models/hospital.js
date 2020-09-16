const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Hospital extends Model {
    static associate(models) {
      Hospital.hasMany(models.HospitalAdministrator);
      Hospital.hasMany(models.HospitalStatusUpdate);
      Hospital.hasMany(models.PatientDelivery);
    }
  }
  Hospital.init(
    {
      id: {
        field: 'hospital_uuid',
        type: DataTypes.UUID,
        primaryKey: true,
        autoIncrement: true,
      },
      hospitalName: {
        field: 'hospitalname',
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      recordUpdateSource: {
        field: 'recordupdatesource',
        type: DataTypes.STRING,
        allowNull: false,
      },
      recordUpdateTimestamp: {
        field: 'recordupdatetimestamp',
        type: DataTypes.DATE,
      },
      recordCreateSource: {
        field: 'recordcreatesource',
        type: DataTypes.STRING,
        allowNull: false,
      },
      recordCreateTimestamp: {
        field: 'recordcreatetimestamp',
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      timestamps: true,
      createdAt: 'recordCreateTimestamp',
      updatedAt: 'recordUpdateTimestamp',
      tableName: 'hospital',
      modelName: 'Hospital',
    }
  );
  return Hospital;
};
