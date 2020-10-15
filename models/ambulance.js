const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Ambulance extends Model {
    static associate(models) {
      Ambulance.belongsTo(models.Organization);

      Ambulance.hasMany(models.PatientDelivery);

      Ambulance.belongsTo(models.User, { as: 'CreatedBy' });
      Ambulance.belongsTo(models.User, { as: 'UpdatedBy' });
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
      OrganizationId: {
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
      tableName: 'ambulance',
      modelName: 'Ambulance',
    }
  );
  return Ambulance;
};
