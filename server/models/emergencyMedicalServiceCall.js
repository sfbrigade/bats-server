const { Model } = require('sequelize');
const metadata = require('../../client/src/shared/metadata/emergencyMedicalServiceCall');
const convertToSequelizeField = require('../../client/src/shared/convertToSequelizeField');

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
  EmergencyMedicalServiceCall.init(metadata.getFieldHash(convertToSequelizeField), {
    sequelize,
    timestamps: true,
    tableName: metadata.tableName,
    modelName: metadata.modelName,
  });
  return EmergencyMedicalServiceCall;
};
