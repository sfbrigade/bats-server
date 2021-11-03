/* eslint-disable no-restricted-syntax, no-await-in-loop */
const models = require('../models');

// hospital admins users to sign in as main user on admin page
const hospitalAdmins = [
  {
    firstName: 'Susan',
    lastName: 'Charles',
    org: 'SF Dept. of Public Health',
    hospital: 'SF General',
    email: 'sfgeneral.eradmin@c4sf.me',
  },
  {
    firstName: 'Mary',
    lastName: 'Albright',
    org: 'Kaiser Permanente',
    hospital: 'Kaiser SF',
    email: 'kaiser.eradmin@c4sf.me',
  },
  {
    firstName: 'Jane',
    lastName: 'Austin',
    org: 'Sutter Health CPMC',
    hospital: 'CPMC Davies',
    email: 'cpmc.davies.eradmin@c4sf.me',
  },
  {
    firstName: 'Chris',
    lastName: 'Lincoln',
    org: 'Sutter Health CPMC',
    hospital: 'CPMC Van Ness',
    email: 'cpmc.vanness.eradmin@c4sf.me',
  },
  {
    firstName: 'Johnathan',
    lastName: 'Strange',
    org: 'Sutter Health CPMC',
    hospital: 'Mission Bernal',
    email: 'mission.bernal.eradmin@c4sf.me',
  },
  {
    firstName: 'Rebecca',
    lastName: 'Strange',
    org: 'Dignity Health',
    hospital: 'St. Francis',
    email: 'stfrancis.eradmin@c4sf.me',
  },
  {
    firstName: 'Syndney',
    lastName: 'Sage',
    org: 'Dignity Health',
    hospital: "St. Mary's",
    email: 'stmarys.eradmin@c4sf.me',
  },
  {
    firstName: 'Adrian',
    lastName: 'Ivashkov',
    org: 'Chinese Hospital',
    hospital: 'Chinese Hospital',
    email: 'chinese.eradmin@c4sf.me',
  },
  {
    firstName: 'Gary',
    lastName: 'Coleman',
    org: 'UCSF Health',
    hospital: 'UCSF Parnassus',
    email: 'ucsf.parnassus.eradmin@c4sf.me',
  },
  {
    firstName: 'Rose',
    lastName: 'Hathaway',
    org: 'Veterans Health Administration',
    hospital: 'VA Med. Center',
    email: 'va.eradmin@c4sf.me',
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

      for (const hospitalAdmin of hospitalAdmins) {
        const org = await models.Organization.findOne({
          where: {
            name: hospitalAdmin.org,
          },
          transaction,
        });

        const hospital = await models.Hospital.findOne({
          where: {
            name: hospitalAdmin.hospital,
          },
        });

        const user = await models.User.create(
          {
            OrganizationId: org.id,
            firstName: hospitalAdmin.firstName,
            lastName: hospitalAdmin.lastName,
            email: hospitalAdmin.email,
            hashedPassword: '$2b$10$s2eQxhoZ2Khb4KrbOaAl/ekpWKiGmyX1HFICIVl3ZX3NnL191fPuS',
            isOperationalUser: true,
            isAdminUser: true,
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
          },
          { transaction }
        );
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      for (const hospitalAdmin of hospitalAdmins) {
        const user = await models.User.findOne({
          where: {
            email: hospitalAdmin.email,
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
// er admin user
