const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EmergencyMedicalServiceCall extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      EmergencyMedicalServiceCall.hasOne(models.Patient, { as: 'patient' });

      EmergencyMedicalServiceCall.belongsTo(models.User, { as: 'createdBy' });
      EmergencyMedicalServiceCall.belongsTo(models.User, { as: 'updatedBy' });
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
      createdAt: {
        field: 'recordcreatetimestamp',
        type: DataTypes.DATE,
      },
      createdById: {
        field: 'recordcreateuser_uuid',
        type: DataTypes.UUID,
      },
      updatedAt: {
        field: 'recordupdatetimestamp',
        type: DataTypes.DATE,
      },
      updatedById: {
        field: 'recordupdateuser_uuid',
        type: DataTypes.UUID,
      },
    },
    {
      sequelize,
      timestamps: true,
      tableName: 'emergencymedicalservicecall',
      modelName: 'EmergencyMedicalServiceCall',
    }
  );
  return EmergencyMedicalServiceCall;
};
