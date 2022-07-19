const { Model } = require('sequelize');
const patient = require('../src/metadata/patient');
const convertToSequelizeField = require('../src/metadata/convertToSequelizeField');

module.exports = (sequelize) => {
  class Patient extends Model {
    static get Params() {
      return patient.getParams();
    }

    static associate(models) {
      Patient.belongsTo(models.EmergencyMedicalServiceCall);
      Patient.hasOne(models.PatientDelivery);

      Patient.belongsTo(models.User, { as: 'CreatedBy' });
      Patient.belongsTo(models.User, { as: 'UpdatedBy' });
    }
  }
  Patient.init(patient.getFieldHash(convertToSequelizeField), {
    sequelize,
    timestamps: true,
    tableName: 'patient',
    modelName: 'Patient',
  });
  return Patient;
};
