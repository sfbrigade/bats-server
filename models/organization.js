const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Organization extends Model {
    static associate(models) {
      Organization.hasMany(models.Ambulance, { as: 'ambulances' });
      Organization.hasMany(models.Hospital, { as: 'hospitals' });
      Organization.hasMany(models.User, { as: 'users' });

      Organization.belongsTo(models.User, { as: 'createdBy' });
      Organization.belongsTo(models.User, { as: 'updatedBy' });
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
        type: DataTypes.STRING,
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
      tableName: 'organization',
      modelName: 'Organization',
    }
  );
  return Organization;
};
