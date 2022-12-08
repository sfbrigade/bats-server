const models = require('../../server/models');
const { DeliveryStatus } = require('../../shared/constants');

(async () => {
  await models.sequelize.transaction(async (transaction) => {
    // find the existing ringdown from this user and then change its status
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

    await patientDelivery.createDeliveryStatusUpdate(user.id, DeliveryStatus.OFFLOADED, new Date(), { transaction });
  });
})();
