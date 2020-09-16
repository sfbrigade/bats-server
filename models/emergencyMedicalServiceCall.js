const { Model } = require('sequelize');

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
    }
  }
  EmergencyMedicalServiceCall.init(
    {
      id: {
        field: 'emergencymedicalservicecall_uuid',
        type: DataTypes.UUID,
        primaryKey: true,
        autoIncrement: true,
      },
      dispatchCallNumber: {
        field: 'dispatchcallnumber',
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      startDateTime: {
        field: 'startdatetime',
        type: DataTypes.DATE,
        allowNull: false,
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
      tableName: 'emergencymedicalservicecall',
      modelName: 'EmergencyMedicalServiceCall',
    }
  );
  return EmergencyMedicalServiceCall;
};
