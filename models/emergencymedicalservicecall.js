"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EmergencyMedicalServiceCall extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      EmergencyMedicalServiceCall.hasMany(models.Patient);
      // define association here
    }
  }
  EmergencyMedicalServiceCall.init(
      {
          emergencymedicalservicecall_uuid: {
              field: "patient",
              type: DataTypes.UUID,
              primaryKey: true,
              allowNull: false,
          },
          dispatchcallnumber: {
              field: "patient",
              type: DataTypes.INTEGER,
              primaryKey: true,
              autoIncrement: true,
          },
          startdatetime: {
              field: "startdatetime",
              type: DataTypes.DATE,
              primaryKey: true,
              allowNull: false,
          },
          recordcreatetimestamp: {
              field: "recordcreatetimestamp",
              type: DataTypes.DATE,
              primaryKey: true,
              allowNull: false,
          },
          recordcreatesource: {
              field: "recordcreatesource",
              type: DataTypes.TEXT,
              primaryKey: true,
              autoIncrement: true,
          },
          recordupdatetimestamp: {
              field: "recordupdatetimestamp",
              type: DataTypes.DATE,
              primaryKey: true,
              allowNull: false,
          },
          recordupdatesource: {
              field: "recordupdatetimestamp",
              type: DataTypes.TEXT,
              primaryKey: true,
              allowNull: false,
          },
      },
    {
      sequelize,
        timestamps: true,
        createdAt: "recordCreateTimestamp",
        updatedAt: "recordUpdateTimestamp",
        tableName: "emergencymedicalservicecall",
        modelName: "EmergencyMedicalServiceCall",
    }
    );
  return EmergencyMedicalServiceCall;
};
