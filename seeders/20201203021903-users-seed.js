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
      const hospital = await models.Hospital.findOne({
        where: {
          name: 'SF General',
        },
      });
      const user = await models.User.create(
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
      await models.User.create(
        {
          OrganizationId: org.id,
          firstName: 'Operational',
          lastName: 'EMS 1',
          email: 'op.ems.1@c4sf.me',
          hashedPassword: '$2b$10$s2eQxhoZ2Khb4KrbOaAl/ekpWKiGmyX1HFICIVl3ZX3NnL191fPuS',
          isOperationalUser: true,
          isAdminUser: false,
          isSuperUser: false,
          CreatedById: superuser.id,
          UpdatedById: superuser.id,
        },
        { transaction }
      );
      await models.User.create(
        {
          OrganizationId: org.id,
          firstName: 'Operational',
          lastName: 'EMS 2',
          email: 'op.ems.2@c4sf.me',
          hashedPassword: '$2b$10$s2eQxhoZ2Khb4KrbOaAl/ekpWKiGmyX1HFICIVl3ZX3NnL191fPuS',
          isOperationalUser: true,
          isAdminUser: false,
          isSuperUser: false,
          CreatedById: superuser.id,
          UpdatedById: superuser.id,
        },
        { transaction }
      );
      await models.User.create(
        {
          OrganizationId: org.id,
          firstName: 'Operational',
          lastName: 'EMS 3',
          email: 'op.ems.3@c4sf.me',
          hashedPassword: '$2b$10$s2eQxhoZ2Khb4KrbOaAl/ekpWKiGmyX1HFICIVl3ZX3NnL191fPuS',
          isOperationalUser: true,
          isAdminUser: false,
          isSuperUser: false,
          CreatedById: superuser.id,
          UpdatedById: superuser.id,
        },
        { transaction }
      );
      await models.User.create(
        {
          OrganizationId: org.id,
          firstName: 'Operational',
          lastName: 'EMS 4',
          email: 'op.ems.4@c4sf.me',
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
      const user = await models.User.findOne({
        where: {
          email: 'op.healthcare@c4sf.me',
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
      await models.User.destroy({
        where: {
          email: 'op.ems@c4sf.me',
        },
        transaction,
      });
    });
  },
};
