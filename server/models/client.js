const bcrypt = require('bcrypt');
const randomString = require('randomstring');
const { Model } = require('sequelize');

const metadata = require('shared/metadata/client');
const initModel = require('../metadata/initModel');

module.exports = (sequelize) => {
  class Client extends Model {
    static associate(models) {
      Client.hasMany(models.Token, { foreignKey: 'client_uuid' });
      Client.belongsTo(models.User);
      Client.belongsTo(models.User, { as: 'CreatedBy' });
      Client.belongsTo(models.User, { as: 'UpdatedBy' });
    }

    authenticate(clientSecret) {
      return bcrypt.compareSync(clientSecret, this.hashedClientSecret);
    }

    generateClientIdAndSecret() {
      const clientId = randomString.generate({ length: 20, readable: true });
      const clientSecret = randomString.generate({ length: 40 });
      this.clientId = clientId;
      this.hashedClientSecret = bcrypt.hashSync(clientSecret, 12);
      return { clientId, clientSecret };
    }

    toJSON() {
      const attributes = { ...this.get() };
      delete attributes.hashedClientSecret;
      return attributes;
    }
  }

  initModel(Client, metadata, sequelize);

  return Client;
};
