const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class HospitalStatusUpdate extends Model {
    static associate(models) {
      HospitalStatusUpdate.belongsTo(models.Hospital);
      HospitalStatusUpdate.belongsTo(models.HospitalAdministrator);
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
      HospitalAdministratorId: {
        field: 'hospitaladministrator_uuid',
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
      recordUpdateSource: {
        field: 'recordupdatesource',
        type: DataTypes.STRING,
        allowNull: false,
      },
      recordCreateSource: {
        field: 'recordcreatesource',
        type: DataTypes.STRING,
        allowNull: false,
      },
      recordUpdateTimestamp: {
        field: 'recordupdatetimestamp',
        type: DataTypes.DATE,
      },
      recordCreateTimestamp: {
        field: 'recordcreatetimestamp',
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      timestamps: true,
      createdAt: 'recordCreateTimestamp',
      updatedAt: 'recordUpdateTimestamp',
      tableName: 'hospitalstatusupdate',
      modelName: 'HospitalStatusUpdate',
    }
  );
  return HospitalStatusUpdate;
};
