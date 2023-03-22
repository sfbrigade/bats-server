const { Model } = require('sequelize');
const metadata = require('shared/metadata/patient');
const initModel = require('../metadata/initModel');

module.exports = (sequelize) => {
  class Patient extends Model {
    static get Params() {
      return metadata.getParams();
    }

    static associate(models) {
      Patient.belongsTo(models.EmergencyMedicalServiceCall);
      Patient.hasOne(models.PatientDelivery);

      Patient.belongsTo(models.User, { as: 'CreatedBy' });
      Patient.belongsTo(models.User, { as: 'UpdatedBy' });
    }
  }

  initModel(Patient, metadata, sequelize);

  return Patient;
};
