const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Hospital extends Model {
    static associate(models) {
      Hospital.belongsTo(models.Organization);

      Hospital.hasMany(models.HospitalStatusUpdate);
      Hospital.hasMany(models.HospitalUser);
      Hospital.hasMany(models.PatientDelivery);

      Hospital.belongsTo(models.User, { as: 'CreatedBy' });
      Hospital.belongsTo(models.User, { as: 'UpdatedBy' });
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
      OrganizationId: {
        field: 'healthcareorganization_uuid',
        type: DataTypes.UUID,
      },
      name: {
        field: 'hospitalname',
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      sortSequenceNumber: {
        field: 'sortsequencenumber',
        type: DataTypes.INTEGER,
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
      tableName: 'hospital',
      modelName: 'Hospital',
    }
  );
  return Hospital;
};
