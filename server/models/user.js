const bcrypt = require('bcrypt');
const _ = require('lodash');
const { Model } = require('sequelize');
const metadata = require('shared/metadata/user');
const initModel = require('../metadata/initModel');
const { sendMail } = require('../mailer/emailTransporter');
const OTPAuth = require('otpauth');

const SALT_ROUNDS = 10;

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Organization);
      User.belongsTo(models.User, { as: 'CreatedBy' });
      User.belongsTo(models.User, { as: 'UpdatedBy' });
      User.hasMany(models.HospitalUser, { foreignKey: 'edadminuser_uuid' });
      User.hasMany(models.HospitalUser.scope('active'), {
        as: 'ActiveHospitalUsers',
        foreignKey: 'edadminuser_uuid',
      });
    }

    async getLoginPayloadJSON(options = {}) {
      const { transaction } = options;
      if (!this.Organization) {
        this.Organization = await this.getOrganization({ transaction });
      }
      if (!this.ActiveHospitalUsers) {
        this.ActiveHospitalUsers = await this.getActiveHospitalUsers({
          include: [sequelize.models.Hospital],
          transaction,
        });
      }
      return this.toJSON();
    }

    toJSON() {
      const attributes = { ...this.get() };
      attributes.organization = this.Organization?.toJSON() || { id: this.OrganizationId };
      if (this.ActiveHospitalUsers) {
        attributes.activeHospitals = this.ActiveHospitalUsers.map((h) => h.toJSON());
      }
      return _.pick(attributes, [
        'id',
        'firstName',
        'lastName',
        'email',
        'isActive',
        'isAdminUser',
        'isOperationalUser',
        'isSuperUser',
        'organization',
        'activeHospitals',
      ]);
    }

    async generateToTPSecret(method = 'twoFactor') {
      const secret = new OTPAuth.Secret();
      // new TOTP object using the secret key
      const totp = new OTPAuth.TOTP({
        secret: secret.base32,
        issuer: 'Routed',
        period: -1,
        digits: 6,
      });
      // save the secret key to the session
      // generate secret token
      const token = totp.generate();
      // Save token and expiration timestamp in DB (Expires in 15 minutes from inital Log In)
      // save totp secret and expiration timestamp in DB

      await this.update({ twoFactorData: { totptimestamp: Date.now() + 900000, totptoken: token } });
      await this.save();
      // send email with token
      if (method === 'twoFactor') {
        await sendMail(this.email, 'Your Authentication Code from Routed', 'twoFactor', {
          verificationCode: token,
        });
      } else if (method === 'resetPassword') {
        const params = new URLSearchParams();
        params.append('email', this.email);
        params.append('code', token);
        await sendMail(this.email, 'Password Reset from Routed', 'passwordReset', {
          passwordResetLink: `${process.env.BASE_URL}/reset?${params}`,
        });
      }
    }

    verifyTwoFactor(token) {
      const totptoken = this.dataValues.twoFactorData.totptoken;
      const totptimestamp = this.dataValues.twoFactorData.totptimestamp;
      const verified = token === totptoken && Date.now() < totptimestamp;
      return verified;
    }
  }

  initModel(User, metadata, sequelize);

  User.beforeSave(async (user) => {
    /// if a new password has been set, hash for storage
    if (user.password) {
      user.hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
    }
  });

  return User;
};
