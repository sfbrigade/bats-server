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
      const ambulances = await models.Ambulance.findAll();
      const firstEmsCall = await models.EmergencyMedicalServiceCall.findOne();
      await Promise.all(
        ambulances.map((ambulance) => {
          return models.EmergencyMedicalServiceCallAmbulance.create(
            {
              EmergencyMedicalServiceCallId: firstEmsCall.id,
              AmbulanceId: ambulance.id,
              startDateTimeLocal: '2021-06-01 04:35:24.871',
              CreatedById: superuser.id,
              UpdatedById: superuser.id,
            },
            { transaction }
          );
        })
      );
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async () => {
      await models.EmergencyMedicalServiceCallAmbulance.destroy({
        truncate: true,
      });
    });
  },
};
