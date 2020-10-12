const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Hospital extends Model {
    static associate(models) {
      Hospital.belongsTo(models.Organization, { as: 'organization' });

      Hospital.hasMany(models.HospitalStatusUpdate);
      Hospital.hasMany(models.HospitalUser);
      Hospital.hasMany(models.PatientDelivery);

      Hospital.belongsTo(models.User, { as: 'createdBy' });
      Hospital.belongsTo(models.User, { as: 'updatedBy' });
    }
  }
  Hospital.init(
    {
      id: {
        field: 'hospital_uuid',
        type: DataTypes.UUID,
        primaryKey: true,
        autoIncrement: true,
      },
      organizationId: {
        field: 'healthcareorganization_uuid',
        type: DataTypes.UUID,
      },
      name: {
        field: 'hospitalname',
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
      tableName: 'hospital',
      modelName: 'Hospital',
    }
  );
  return Hospital;
};
