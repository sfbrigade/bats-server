const models = require('../models');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const org = await models.Organization.create(
        {
          name: 'Code for San Francisco',
          type: 'C4SF',
          CreatedById: '00000000-0000-0000-0000-000000000000',
          UpdatedById: '00000000-0000-0000-0000-000000000000',
        },
        { transaction }
      );
      const superuser = await models.User.create(
        {
          OrganizationId: org.id,
          firstName: 'C4SF',
          lastName: 'Admin',
          email: 'batsadmin@c4sf.org',
          hashedPassword: '$2b$10$s2eQxhoZ2Khb4KrbOaAl/ekpWKiGmyX1HFICIVl3ZX3NnL191fPuS',
          isOperationalUser: true,
          isAdminUser: true,
          isSuperUser: true,
          CreatedById: '00000000-0000-0000-0000-000000000000',
          UpdatedById: '00000000-0000-0000-0000-000000000000',
        },
        { transaction }
      );
      await org.update(
        {
          CreatedById: superuser.id,
          UpdatedById: superuser.id,
        },
        { transaction }
      );
      await superuser.update(
        {
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
          email: 'batsadmin@c4sf.org',
        },
        transaction,
      });
      await models.Organization.destroy({
        where: {
          name: 'Code for San Francisco',
          type: 'C4SF',
        },
        transaction,
      });
    });
  },
};
