const models = require('../../server/models');
const { DeliveryStatus } = require('../../shared/constants');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const email = 'op.ems.3@c4sf.me';
      const user = await models.User.findOne({
        where: {
          email,
        },
        transaction,
      });
      const patientDelivery = await models.PatientDelivery.findOne({
        where: {
          paramedicuser_uuid: user.id,
        },
        transaction,
      });

      await patientDelivery.createDeliveryStatusUpdate(user.id, DeliveryStatus.REDIRECTED, new Date(), { transaction });
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
