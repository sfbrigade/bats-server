const _ = require('lodash');
const { Model } = require('sequelize');
const { DeliveryStatus } = require('../constants');

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

    async getAmbulanceCounts(options) {
      const counts = await sequelize.models.PatientDelivery.count({
        where: {
          HospitalId: this.id,
        },
        group: ['currentDeliveryStatus'],
        transaction: options?.transaction,
      });
      const ambulanceCounts = {
        enRoute: 0,
        offloading: 0,
      };
      counts.forEach((count) => {
        if (
          count.currentDeliveryStatus === DeliveryStatus.RINGDOWN_SENT ||
          count.currentDeliveryStatus === DeliveryStatus.RINGDOWN_RECEIVED
        ) {
          ambulanceCounts.enRoute += parseInt(count.count, 10);
        } else if (count.currentDeliveryStatus === DeliveryStatus.ARRIVED) {
          ambulanceCounts.offloading += parseInt(count.count, 10);
        }
      });
      this.ambulanceCounts = ambulanceCounts;
      return ambulanceCounts;
    }

    toJSON() {
      const attributes = { ...this.get() };
      return _.pick(attributes, ['id', 'name', 'sortSequenceNumber', 'isActive']);
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
