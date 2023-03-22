const { Model } = require('sequelize');
const metadata = require('shared/metadata/ambulance');
const initModel = require('../metadata/initModel');

module.exports = (sequelize) => {
  class Ambulance extends Model {
    static associate(models) {
      Ambulance.belongsTo(models.Organization);

      Ambulance.hasMany(models.PatientDelivery);
      Ambulance.hasMany(models.EmergencyMedicalServiceCallAmbulance);
      Ambulance.belongsToMany(models.EmergencyMedicalServiceCall, { through: models.EmergencyMedicalServiceCallAmbulance });

      Ambulance.belongsTo(models.User, { as: 'CreatedBy' });
      Ambulance.belongsTo(models.User, { as: 'UpdatedBy' });
    }
  }

  initModel(Ambulance, metadata, sequelize);

  return Ambulance;
};
