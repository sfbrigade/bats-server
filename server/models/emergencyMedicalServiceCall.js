const { Model } = require('sequelize');
const metadata = require('shared/metadata/emergencyMedicalServiceCall');
const initModel = require('../metadata/initModel');

module.exports = (sequelize) => {
  class EmergencyMedicalServiceCall extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      EmergencyMedicalServiceCall.hasOne(models.Patient);

      EmergencyMedicalServiceCall.hasMany(models.EmergencyMedicalServiceCallAmbulance);
      EmergencyMedicalServiceCall.belongsToMany(models.Ambulance, { through: models.EmergencyMedicalServiceCallAmbulance });

      EmergencyMedicalServiceCall.belongsTo(models.User, { as: 'CreatedBy' });
      EmergencyMedicalServiceCall.belongsTo(models.User, { as: 'UpdatedBy' });
    }
  }

  initModel(EmergencyMedicalServiceCall, metadata, sequelize);

  return EmergencyMedicalServiceCall;
};
