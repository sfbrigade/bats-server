const { Model } = require('sequelize');
const metadata = require('../../shared/metadata/patientDeliveryUpdate');
const initModel = require('../metadata/initModel');

module.exports = (sequelize) => {
  class PatientDeliveryUpdate extends Model {
    static associate(models) {
      PatientDeliveryUpdate.belongsTo(models.PatientDelivery);
      PatientDeliveryUpdate.belongsTo(models.User, { as: 'CreatedBy' });
      PatientDeliveryUpdate.belongsTo(models.User, { as: 'UpdatedBy' });
    }
  }

  initModel(PatientDeliveryUpdate, metadata, sequelize);

  return PatientDeliveryUpdate;
};
