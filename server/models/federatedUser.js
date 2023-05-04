const { Model } = require('sequelize');
const metadata = require('shared/metadata/federatedUser');
const initModel = require('../metadata/initModel');

module.exports = (sequelize) => {
  class FederatedUser extends Model {
    static associate(models) {
      FederatedUser.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }

  initModel(FederatedUser, metadata, sequelize);

  return FederatedUser;
};
