const { Model } = require('sequelize');

const metadata = require('shared/metadata/invite');
const initModel = require('../metadata/initModel');

module.exports = (sequelize) => {
  class Invite extends Model {
    static associate(models) {
      Invite.belongsTo(models.Organization);
      Invite.belongsTo(models.User, { as: 'AcceptedBy' });
      Invite.belongsTo(models.User, { as: 'RevokedBy' });
      Invite.belongsTo(models.User, { as: 'CreatedBy' });
      Invite.belongsTo(models.User, { as: 'UpdatedBy' });
    }
  }

  initModel(Invite, metadata, sequelize);

  return Invite;
};
