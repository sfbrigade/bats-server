const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Ambulance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Ambulance.hasMany(models.Patientdelivery);
    }
  }
  Ambulance.init(
    {
      Id: {
        field: "ambulance_uuid",
        type: DataTypes.UUID,
        primaryKey: true,
        autoIncrement: true,
      },
      EmergencyMedicalServiceProvider_uuid: {
        field: "emergencymedicalserviceprovider_uuid",
        type: DataTypes.UUID,
        primaryKey: true,
      },
      AmbulanceIdentifier: {
        field: "ambulanceidentifier",
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      RecordCreateTimeStamp: {
        field: "recordcreatetimestamp",
        type: DataTypes.DATE,
        allowNull: false,
      },
      RecordCreateSource: {
        field: "recordcreatesource",
        type: DataTypes.STRING,
        allowNull: false,
      },
      RecordUpdateTimestamp: {
        field: "recordupdatetimestamp",
        type: DataTypes.DATE,
        allowNull: false,
      },
      RecordUpdateSource: {
        field: "recordupdatesource",
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: true,
      createdAt: "recordCreateTimestamp",
      updatedAt: "recordUpdateTimestamp",
      tableName: "ambulance",
      modelName: "Ambulance",
    }
  );
  return Ambulance;
};
