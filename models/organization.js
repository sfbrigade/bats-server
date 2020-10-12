const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Organization extends Model {
    static associate(models) {
      Organization.hasMany(models.Ambulance);
      Organization.hasMany(models.Hospital);
      Organization.hasMany(models.User);

      Organization.belongsTo(models.User, { as: 'CreatedBy' });
      Organization.belongsTo(models.User, { as: 'UpdatedBy' });
    }
  }
  Organization.init(
    {
      id: {
        field: 'organization_uuid',
        type: DataTypes.UUID,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        field: 'organizationname',
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        field: 'organizationtypename',
        type: DataTypes.ENUM('C4SF', 'EMS', 'HEALTHCARE'),
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
      tableName: 'organization',
      modelName: 'Organization',
    }
  );
  return Organization;
};
