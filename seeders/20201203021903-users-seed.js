const models = require('../models');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const superuser = await models.User.findOne({
        where: {
          email: 'batsadmin@c4sf.me',
        },
        transaction,
      });
      let org;
      org = await models.Organization.findOne({
        where: {
          name: 'SF Dept. of Public Health',
        },
        transaction,
      });
      await models.User.create(
        {
          OrganizationId: org.id,
          firstName: 'Operational',
          lastName: 'Healthcare',
          email: 'op.healthcare@c4sf.me',
          hashedPassword: '$2b$10$s2eQxhoZ2Khb4KrbOaAl/ekpWKiGmyX1HFICIVl3ZX3NnL191fPuS',
          isOperationalUser: true,
          isAdminUser: false,
          isSuperUser: false,
          CreatedById: superuser.id,
          UpdatedById: superuser.id,
        },
        { transaction }
      );
      org = await models.Organization.findOne({
        where: {
          name: 'San Francisco Fire Department',
        },
        transaction,
      });
      await models.User.create(
        {
          OrganizationId: org.id,
          firstName: 'Operational',
          lastName: 'EMS',
          email: 'op.ems@c4sf.me',
          hashedPassword: '$2b$10$s2eQxhoZ2Khb4KrbOaAl/ekpWKiGmyX1HFICIVl3ZX3NnL191fPuS',
          isOperationalUser: true,
          isAdminUser: false,
          isSuperUser: false,
          CreatedById: superuser.id,
          UpdatedById: superuser.id,
        },
        { transaction }
      );
    });
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await models.User.destroy({
        where: {
          email: 'op.healthcare@c4sf.me',
        },
        transaction,
      });
      await models.User.destroy({
        where: {
          email: 'op.ems@c4sf.me',
        },
        transaction,
      });
    });
  },
};
