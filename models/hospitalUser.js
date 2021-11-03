const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class HospitalUser extends Model {
    static associate(models) {
      HospitalUser.belongsTo(models.Hospital);
      HospitalUser.belongsTo(models.User, { as: 'EdAdminUser' });

      HospitalUser.belongsTo(models.User, { as: 'CreatedBy' });
      HospitalUser.belongsTo(models.User, { as: 'UpdatedBy' });
    }
  }

  HospitalUser.init(
    {
      id: {
        field: 'hospitaluser_uuid',
        type: DataTypes.UUID,
        primaryKey: true,
        autoIncrement: true,
      },
      HospitalId: {
        field: 'hospital_uuid',
        type: DataTypes.UUID,
        unique: true,
        allowNull: false,
      },
      EdAdminUserId: {
        field: 'edadminuser_uuid',
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      isActive: {
        field: 'activeindicator',
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      isAod: {
        field: 'isAod',
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
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
      tableName: 'hospitaluser',
      modelName: 'HospitalUser',
    }
  );

  HospitalUser.addScope('active', {
    where: { isActive: true },
  });

  return HospitalUser;
};
