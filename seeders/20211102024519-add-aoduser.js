/* eslint-disable no-restricted-syntax, no-await-in-loop */
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
    

    const org = await models.Organization.findOne({
      where: {
        name: 'SF Dept. of Public Health',
      },
      transaction,
    });

    const hospital = await models.Hospital.findOne({
      where: {
        name: 'SF General',
      },
      transaction,
    });

    const user = await models.User.create(
      {
        OrganizationId: org.id,
        firstName: 'Susan',
        lastName: 'Saley',
        email: 'sfgeneral.eraod@c4sf.me',
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
        isAod: true,
      },
      { transaction }
    );
    })
  },

  

  down: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
        const user = await models.User.findOne({
          where: {
            email: 'sfgeneral.eraod@c4sf.me',
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
      
    });
  },

};
