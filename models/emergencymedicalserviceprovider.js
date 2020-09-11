const { Model } = require('sequelize');

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
  EmergencyMedicalServiceProvider.init(
    {
      id: {
        field: 'emergencymedicalserviceprovider_uuid',
        type: DataTypes.UUID,
        primaryKey: true,
        autoIncrement: true,
      },
      emergencyMedicalServiceProviderName: {
        field: 'emergencymedicalserviceprovidername',
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: true,
      },
      recordCreateTimestamp: {
        field: 'recordcreatetimestamp',
        type: DataTypes.DATE,
      },
      recordCreateSource: {
        field: 'patient',
        type: DataTypes.STRING,
      },
      recordUpdateTimestamp: {
        field: 'recordupdatetimestamp',
        type: DataTypes.DATE,
      },
      recordUpdateSource: {
        field: 'patient',
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: true,
      createdAt: 'recordCreateTimestamp',
      updatedAt: 'recordUpdateTimestamp',
      tableName: 'emergencymedicalserviceprovider',
      modelName: 'EmergencyMedicalServiceProvider',
    }
  );
  return EmergencyMedicalServiceProvider;
};
