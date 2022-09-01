const { Model } = require('sequelize');
const metadata = require('../src/metadata/emergencyMedicalServiceCallAmbulance');
const convertToSequelizeField = require('../src/metadata/convertToSequelizeField');

module.exports = (sequelize) => {
  class EmergencyMedicalServiceCallAmbulance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      EmergencyMedicalServiceCallAmbulance.belongsTo(models.EmergencyMedicalServiceCall);
      EmergencyMedicalServiceCallAmbulance.belongsTo(models.Ambulance);

      EmergencyMedicalServiceCallAmbulance.belongsTo(models.User, { as: 'CreatedBy' });
      EmergencyMedicalServiceCallAmbulance.belongsTo(models.User, { as: 'UpdatedBy' });
    }
  }
  EmergencyMedicalServiceCallAmbulance.init(metadata.getFieldHash(convertToSequelizeField), {
    sequelize,
    timestamps: true,
    tableName: metadata.tableName,
    modelName: metadata.modelName,
  });
  return EmergencyMedicalServiceCallAmbulance;
};
