const _ = require('lodash');
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

    toJSON() {
      const attributes = { ...this.get() };
      attributes.organization = this.Organization?.toJSON() || { id: this.OrganizationId };
      return _.pick(attributes, ['id', 'name', 'type', 'timeZoneIsoCode', 'isActive']);
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
        field: 'organizationtypeenum',
        type: DataTypes.ENUM('EMS', 'HEALTHCARE', 'C4SF'),
        allowNull: false,
      },
      timeZoneIsoCode: {
        field: 'timezoneisocode',
        type: DataTypes.STRING,
      },
      isActive: {
        field: 'activeindicator',
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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
