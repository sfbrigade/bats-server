const { Model } = require('sequelize');
const metadata = require('../src/metadata/patientDeliveryUpdate');
const convertToSequelizeField = require('../src/metadata/convertToSequelizeField');

module.exports = (sequelize) => {
  class PatientDeliveryUpdate extends Model {
    static associate(models) {
      PatientDeliveryUpdate.belongsTo(models.PatientDelivery);
      PatientDeliveryUpdate.belongsTo(models.User, { as: 'CreatedBy' });
      PatientDeliveryUpdate.belongsTo(models.User, { as: 'UpdatedBy' });
    }
  }
  PatientDeliveryUpdate.init(metadata.getFieldHash(convertToSequelizeField), {
    sequelize,
    timestamps: true,
    tableName: metadata.tableName,
    modelName: metadata.modelName,
  });
  return PatientDeliveryUpdate;
};
