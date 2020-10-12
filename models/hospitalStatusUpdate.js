const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class HospitalStatusUpdate extends Model {
    static associate(models) {
      HospitalStatusUpdate.belongsTo(models.Hospital);
      HospitalStatusUpdate.belongsTo(models.User, { as: 'EdAdminUser' });

      HospitalStatusUpdate.belongsTo(models.User, { as: 'CreatedBy' });
      HospitalStatusUpdate.belongsTo(models.User, { as: 'UpdatedBy' });
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
      HospitalId: {
        field: 'hospital_uuid',
        type: DataTypes.UUID,
        unique: true,
        allowNull: false,
      },
      EdAdminUserId: {
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
      tableName: 'hospitalstatusupdate',
      modelName: 'HospitalStatusUpdate',
    }
  );
  return HospitalStatusUpdate;
};
