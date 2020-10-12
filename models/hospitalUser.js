const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class HospitalUser extends Model {
    static associate(models) {
      HospitalUser.belongsTo(models.Hospital, { as: 'hospital' });
      HospitalUser.belongsTo(models.User, { as: 'edAdminUser' });

      HospitalUser.hasMany(models.HospitalStatusUpdate);

      HospitalUser.belongsTo(models.User, { as: 'createdBy' });
      HospitalUser.belongsTo(models.User, { as: 'updatedBy' });
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
      hospitalId: {
        field: 'hospital_uuid',
        type: DataTypes.UUID,
        unique: true,
        allowNull: false,
      },
      edAdminUserId: {
        field: 'edadminuser_uuid',
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
      tableName: 'hospitaluser',
      modelName: 'HospitalUser',
    }
  );
  return HospitalUser;
};
