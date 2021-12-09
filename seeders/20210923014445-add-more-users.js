/* eslint-disable no-restricted-syntax, no-await-in-loop */
const models = require('../models');

const accounts = [
  {
    org: 'Kaiser Permanente',
    hospital: 'Kaiser SF',
    email: 'kaiser.er@c4sf.me',
  },
  {
    org: 'Sutter Health CPMC',
    hospital: 'CPMC Davies',
    email: 'cpmc.davies.er@c4sf.me',
  },
  {
    org: 'Sutter Health CPMC',
    hospital: 'CPMC Van Ness',
    email: 'cpmc.vanness.er@c4sf.me',
  },
  {
    org: 'Sutter Health CPMC',
    hospital: 'Mission Bernal',
    email: 'mission.bernal.er@c4sf.me',
  },
  {
    org: 'Dignity Health',
    hospital: 'St. Francis',
    email: 'stfrancis.er@c4sf.me',
  },
  {
    org: 'Dignity Health',
    hospital: "St. Mary's",
    email: 'stmarys.er@c4sf.me',
  },
  {
    org: 'Chinese Hospital',
    hospital: 'Chinese Hospital',
    email: 'chinese.er@c4sf.me',
  },
  {
    org: 'UCSF Health',
    hospital: 'UCSF Parnassus',
    email: 'ucsf.parnassus.er@c4sf.me',
  },
  {
    org: 'Veterans Health Administration',
    hospital: 'VA Med. Center',
    email: 'va.er@c4sf.me',
  },
];

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const superuser = await models.User.findOne({
        where: {
          email: 'batsadmin@c4sf.me',
        },
        transaction,
      });
      for (const account of accounts) {
        const org = await models.Organization.findOne({
          where: {
            name: account.org,
          },
          transaction,
        });
        const hospital = await models.Hospital.findOne({
          where: {
            name: account.hospital,
          },
        });
        const user = await models.User.create(
          {
            OrganizationId: org.id,
            firstName: 'Operational',
            lastName: 'Healthcare',
            email: account.email,
            hashedPassword: '$2b$10$s2eQxhoZ2Khb4KrbOaAl/ekpWKiGmyX1HFICIVl3ZX3NnL191fPuS',
            isOperationalUser: true,
            isAdminUser: false,
            isSuperUser: false,
            CreatedById: superuser.id,
            UpdatedById: superuser.id,
          },
          { transaction }
        );
        await models.HospitalUser.create(
          {
            HospitalId: hospital.id,
            EdAdminUserId: user.id,
            CreatedById: superuser.id,
            UpdatedById: superuser.id,
            isInfoUser: true,
            isRingdownUser: true,
          },
          { transaction }
        );
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      for (const account of accounts) {
        const user = await models.User.findOne({
          where: {
            email: account.email,
          },
          transaction,
        });
        await models.HospitalUser.destroy({
          where: {
            EdAdminUserId: user.id,
          },
          transaction,
        });
        await user.destroy({ transaction });
      }
    });
  },
};
