const { Model } = require('sequelize');
const metadata = require('../../shared/metadata/patient');
const convertToSequelizeField = require('../../shared/convertToSequelizeField');

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
  Patient.init(metadata.getFieldHash(convertToSequelizeField), {
    sequelize,
    timestamps: true,
    tableName: metadata.tableName,
    modelName: metadata.modelName,
  });
  return Patient;
};
