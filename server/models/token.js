const randomString = require('randomstring');
const { Model } = require('sequelize');

const metadata = require('shared/metadata/token');
const initModel = require('../metadata/initModel');

module.exports = (sequelize) => {
  class Token extends Model {
    static associate(models) {
      Token.belongsTo(models.Client, { as: 'client' });
      Token.belongsTo(models.User, { as: 'user' });
      Token.belongsTo(models.User, { as: 'CreatedBy' });
      Token.belongsTo(models.User, { as: 'UpdatedBy' });
    }

    generateAccessToken(expiresAt) {
      this.accessToken = randomString.generate({ length: 40, readable: true });
      this.accessTokenExpiresAt = expiresAt;
    }

    generateRefreshToken(expiresAt) {
      this.refreshToken = randomString.generate({ length: 40, readable: true });
      this.refreshTokenExpiresAt = expiresAt;
    }
  }

  initModel(Token, metadata, sequelize);

  return Token;
};
