const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class HospitalStatusUpdate extends Model {
    static associate(models) {
      HospitalStatusUpdate.belongsTo(models.Hospital, { as: 'hospital' });
      HospitalStatusUpdate.belongsTo(models.User, { as: 'edAdminUser' });

      HospitalStatusUpdate.belongsTo(models.User, { as: 'createdBy' });
      HospitalStatusUpdate.belongsTo(models.User, { as: 'updatedBy' });
    }
  }
  HospitalStatusUpdate.init(
    {
      id: {
        field: 'hospitalstatusupdate_uuid',
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
        type: DataTypes.UUID,
        unique: true,
        allowNull: false,
      },
      updateDatetime: {
        field: 'updatedatetime',
        type: DataTypes.DATE,
        unique: true,
        allowNull: false,
      },
      openEdBedCount: {
        field: 'openedbedcount',
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      edWaitingRoomCount: {
        field: 'edwaitingroomcount',
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      divertStatusIndicator: {
        field: 'divertstatusindicator',
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      additionalServiceAvailabilityNotes: {
        field: 'additionalserviceavailabilitynotes',
        type: DataTypes.TEXT,
        allowNull: true,
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
      tableName: 'hospitalstatusupdate',
      modelName: 'HospitalStatusUpdate',
    }
  );
  return HospitalStatusUpdate;
};
