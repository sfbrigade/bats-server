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
      // define association here
        EmergencyMedicalServiceCall.hasOne(models.Patient);
        EmergencyMedicalServiceCall.belongsTo(models.Patient);
    }
  }
  EmergencyMedicalServiceCall.init(
      {
          Id: {
              field: "emergencymedicalservicecall_uuid",
              type: DataTypes.UUID,
              primaryKey: true,
              allowNull: false,
          },
          DispatchCallNumber: {
              field: "dispatchcallnumber",
              type: DataTypes.INTEGER,
              primaryKey: true,
              autoIncrement: true,
          },
          StartDateTime: {
              field: "startdatetime",
              type: DataTypes.DATE,
              primaryKey: true,
              allowNull: false,
          },
          RecordCreateTimestamp: {
              field: "recordcreatetimestamp",
              type: DataTypes.DATE,
              primaryKey: true,
              allowNull: false,
          },
          RecordCreateSource: {
              field: "recordcreatesource",
              type: DataTypes.STRING,
              primaryKey: true,
          },
          RecordUpdateTimestamp: {
              field: "recordupdatetimestamp",
              type: DataTypes.DATE,
              primaryKey: true,
              allowNull: false,
          },
          RecordUpdateSource: {
              field: "recordupdatetimestamp",
              type: DataTypes.STRING,
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
