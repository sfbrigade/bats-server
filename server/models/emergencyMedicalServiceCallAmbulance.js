const { Model } = require('sequelize');
const metadata = require('../../shared/metadata/emergencyMedicalServiceCallAmbulance');
const initModel = require('../metadata/initModel');

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

  initModel(EmergencyMedicalServiceCallAmbulance, metadata, sequelize);

  return EmergencyMedicalServiceCallAmbulance;
};
