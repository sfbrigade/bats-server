const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Ambulance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Ambulance.belongsTo(models.EmergencyMedicalServiceProvider);
      Ambulance.hasMany(models.PatientDelivery);
    }
  }
  Ambulance.init(
    {
      id: {
        field: 'ambulance_uuid',
        type: DataTypes.UUID,
        primaryKey: true,
        autoIncrement: true,
      },
      EmergencyMedicalServiceProviderId: {
        field: 'emergencymedicalserviceprovider_uuid',
        type: DataTypes.UUID,
        primaryKey: true,
      },
      ambulanceIdentifier: {
        field: 'ambulanceidentifier',
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      recordCreateTimeStamp: {
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
      tableName: 'ambulance',
      modelName: 'Ambulance',
    }
  );
  return Ambulance;
};
