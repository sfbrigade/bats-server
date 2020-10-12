const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Ambulance extends Model {
    static associate(models) {
      Ambulance.belongsTo(models.Organization, { as: 'organization' });

      Ambulance.hasMany(models.PatientDelivery, { as: 'patientDeliveries' });

      Ambulance.belongsTo(models.User, { as: 'createdBy' });
      Ambulance.belongsTo(models.User, { as: 'updatedBy' });
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
      organizationId: {
        field: 'emsorganization_uuid',
        type: DataTypes.UUID,
      },
      ambulanceIdentifier: {
        field: 'ambulanceidentifier',
        type: DataTypes.STRING,
        unique: true,
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
      tableName: 'ambulance',
      modelName: 'Ambulance',
    }
  );
  return Ambulance;
};
