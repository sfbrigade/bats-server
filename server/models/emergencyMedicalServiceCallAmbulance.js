const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EmergencyMedicalServiceCallAmbulance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      EmergencyMedicalServiceCallAmbulance.belongsTo(models.EmergencyMedicalServiceCall);
      EmergencyMedicalServiceCallAmbulance.belongsTo(models.Ambulance);

      EmergencyMedicalServiceCallAmbulance.belongsTo(models.User, { as: 'CreatedBy' });
      EmergencyMedicalServiceCallAmbulance.belongsTo(models.User, { as: 'UpdatedBy' });
    }
  }
  EmergencyMedicalServiceCallAmbulance.init(
    {
      id: {
        field: 'emergencymedicalservicecallambulance_uuid',
        type: DataTypes.UUID,
        primaryKey: true,
        autoIncrement: true,
      },
      EmergencyMedicalServiceCallId: {
        field: 'emergencymedicalservicecall_uuid',
        type: DataTypes.UUID,
      },
      AmbulanceId: {
        field: 'ambulance_uuid',
        type: DataTypes.UUID,
      },
      startDateTimeLocal: {
        field: 'startdatetimelocal',
        type: DataTypes.DATE,
        allowNull: false,
      },
      createdAt: {
        field: 'recordcreatetimestamp',
        type: DataTypes.DATE,
      },
      CreatedById: {
        field: 'recordcreateuser_uuid',
        type: DataTypes.UUID,
      },
      updatedAt: {
        field: 'recordupdatetimestamp',
        type: DataTypes.DATE,
      },
      UpdatedById: {
        field: 'recordupdateuser_uuid',
        type: DataTypes.UUID,
      },
    },
    {
      sequelize,
      timestamps: true,
      tableName: 'emergencymedicalservicecallambulance',
      modelName: 'EmergencyMedicalServiceCallAmbulance',
    }
  );
  return EmergencyMedicalServiceCallAmbulance;
};
