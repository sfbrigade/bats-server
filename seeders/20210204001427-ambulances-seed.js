const models = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const superuser = await models.User.findOne({
        where: {
          email: 'batsadmin@c4sf.me',
        },
        transaction,
      });
      const org = await models.Organization.findOne({
        where: {
          name: 'San Francisco Fire Department',
        },
        transaction,
      });
      await models.Ambulance.create(
        {
          OrganizationId: org.id,
          ambulanceIdentifier: 'SFFD-1',
          CreatedById: superuser.id,
          UpdatedById: superuser.id,
        },
        { transaction }
      );
      await models.Ambulance.create(
        {
          OrganizationId: org.id,
          ambulanceIdentifier: 'SFFD-2',
          CreatedById: superuser.id,
          UpdatedById: superuser.id,
        },
        { transaction }
      );
      await models.Ambulance.create(
        {
          OrganizationId: org.id,
          ambulanceIdentifier: 'SFFD-3',
          CreatedById: superuser.id,
          UpdatedById: superuser.id,
        },
        { transaction }
      );
      await models.Ambulance.create(
        {
          OrganizationId: org.id,
          ambulanceIdentifier: 'SFFD-4',
          CreatedById: superuser.id,
          UpdatedById: superuser.id,
        },
        { transaction }
      );
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await models.HospitalUser.destroy({
        where: {
          ambulanceIdentifier: ['SFFD-1', 'SFFD-2', 'SFFD-3', 'SFFD-4'],
        },
        transaction,
      });
    });
  },
};
