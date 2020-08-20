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
      EmergencyMedicalServiceCall.hasOne(models.Patient);
      // define association here
    }
  }
  EmergencyMedicalServiceCall.init(
    {
      emergencymedicalservicecall_uuid: DataTypes.UUID,
      dispatchcallnumber: DataTypes.INTEGER,
      startdatetime: DataTypes.DATE,
      recordcreatetimestamp: DataTypes.DATE,
      recordcreatesource: DataTypes.TEXT,
      recordupdatetimestamp: DataTypes.DATE,
      recordupdatesource: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "EmergencyMedicalServiceCall",
    }
  );
  return EmergencyMedicalServiceCall;
};
