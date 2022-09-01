const { Model } = require('sequelize');
const patientMeta = require('../src/metadata/patient');
const convertToSequelizeField = require('../src/metadata/convertToSequelizeField');

module.exports = (sequelize) => {
  class Patient extends Model {
    static get Params() {
      return patientMeta.getParams();
    }

    static associate(models) {
      Patient.belongsTo(models.EmergencyMedicalServiceCall);
      Patient.hasOne(models.PatientDelivery);

      Patient.belongsTo(models.User, { as: 'CreatedBy' });
      Patient.belongsTo(models.User, { as: 'UpdatedBy' });
    }
  }
  Patient.init(patientMeta.getFieldHash(convertToSequelizeField), {
    sequelize,
    timestamps: true,
    tableName: patientMeta.tableName,
    modelName: patientMeta.modelName,
  });
  return Patient;
};
