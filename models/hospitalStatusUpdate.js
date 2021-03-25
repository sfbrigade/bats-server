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
      updateDateTimeLocal: {
        field: 'updatedatetimelocal',
        type: DataTypes.DATE,
        unique: true,
        allowNull: false,
      },
      openEdBedCount: {
        field: 'openedbedcount',
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      openPsychBedCount: {
        field: 'openpsychbedcount',
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bedCountUpdateDateTimeLocal: {
        field: 'bedcountupdatedatetimelocal',
        type: DataTypes.DATE,
      },
      divertStatusIndicator: {
        field: 'divertstatusindicator',
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      divertStatusUpdateDateTimeLocal: {
        field: 'divertstatusupdatedatetimelocal',
        type: DataTypes.DATE,
      },
      additionalServiceAvailabilityNotes: {
        field: 'additionalserviceavailabilitynotes',
        type: DataTypes.TEXT,
        allowNull: true,
      },
      notesUpdateDateTimeLocal: {
        field: 'notesupdatedatetimelocal',
        type: DataTypes.DATE,
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
  HospitalStatusUpdate.addScope('latest', () => ({
    attributes: [sequelize.literal('DISTINCT ON("HospitalStatusUpdate".hospital_uuid) 1')].concat(
      Object.keys(HospitalStatusUpdate.rawAttributes)
    ),
    order: [
      ['HospitalId', 'ASC'],
      ['updateDateTimeLocal', 'DESC'],
    ],
  }));
  return HospitalStatusUpdate;
};
