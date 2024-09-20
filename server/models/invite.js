const { Model } = require('sequelize');
const _ = require('lodash');

const metadata = require('shared/metadata/invite');
const { sendMail } = require('../mailer/emailTransporter');
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

    toJSON() {
      const json = _.pick(this.get(), [
        'id',
        'OrganizationId',
        'firstName',
        'lastName',
        'email',
        'message',
        'isOperationalUser',
        'isAdminUser',
        'isSuperUser',
        'ResentById',
        'resentAt',
        'AcceptedById',
        'acceptedAt',
        'RevokedById',
        'revokedAt',
        'CreatedById',
        'createdAt',
        'UpdatedById',
        'updatedAt',
      ]);
      return json;
    }

    sendInviteEmail() {
      return sendMail(this.fullNameAndEmail, undefined, 'invite', {
        firstName: this.firstName,
        url: `${process.env.BASE_URL}/invites/${this.id}`,
        message: this.message,
      });
    }
  }

  initModel(Invite, metadata, sequelize);

  return Invite;
};
