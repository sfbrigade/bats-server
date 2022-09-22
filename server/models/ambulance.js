const { Model } = require('sequelize');
const metadata = require('../../shared/metadata/ambulance');
const convertToSequelizeField = require('../../shared/convertToSequelizeField');

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

  Ambulance.init(metadata.getFieldHash(convertToSequelizeField), {
    sequelize,
    timestamps: true,
    tableName: metadata.tableName,
    modelName: metadata.modelName,
  });
  return Ambulance;
};
