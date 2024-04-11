const bcrypt = require('bcrypt');
const randomString = require('randomstring');
const { Model } = require('sequelize');

const metadata = require('shared/metadata/client');
const initModel = require('../metadata/initModel');

module.exports = (sequelize) => {
  class Client extends Model {
    static associate(models) {
      Client.hasMany(models.Token, { foreignKey: 'clientId' });
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
      const data = { ...this.get() };
      delete data.hashedClientSecret;
      data.User = this.User?.toJSON();
      data.UserEmail = this.User?.email;
      return data;
    }
  }

  initModel(Client, metadata, sequelize);

  return Client;
};
