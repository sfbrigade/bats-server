const { Model } = require('sequelize');
const { DeliveryStatus } = require('../src/constants');

module.exports = (sequelize, DataTypes) => {
  class PatientDeliveryUpdate extends Model {
    static associate(models) {
      PatientDeliveryUpdate.belongsTo(models.PatientDelivery);
      PatientDeliveryUpdate.belongsTo(models.User, { as: 'CreatedBy' });
      PatientDeliveryUpdate.belongsTo(models.User, { as: 'UpdatedBy' });
    }
  }
  PatientDeliveryUpdate.init(
    {
      id: {
        field: 'patientdeliveryupdate_uuid',
        type: DataTypes.UUID,
        primaryKey: true,
        autoIncrement: true,
      },
      PatientDeliveryId: {
        field: 'patientdelivery_uuid',
        type: DataTypes.UUID,
        allowNull: false,
      },
      deliveryStatus: {
        field: 'deliverystatusenum',
        type: DataTypes.ENUM(DeliveryStatus.ALL_STATUSES),
        allowNull: false,
      },
      deliveryStatusDateTimeLocal: {
        field: 'deliverystatusdatetimelocal',
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
      tableName: 'patientdeliveryupdate',
      modelName: 'PatientDeliveryUpdate',
    }
  );
  return PatientDeliveryUpdate;
};
