const _ = require('lodash');
const models = require('../models');
const { DeliveryStatus } = require('shared/constants');

async function createRingdown(
  email,
  ambulanceIdentifier,
  hospitalName,
  dispatchCallNumber,
  patientData,
  deliveryStatus,
  etaMinutes,
  transaction
) {
  const user = await models.User.findOne({
    where: {
      email,
    },
    transaction,
  });
  const ambulance = await models.Ambulance.findOne({
    where: {
      ambulanceIdentifier,
    },
    transaction,
  });
  const hospital = await models.Hospital.findOne({
    where: {
      name: hospitalName,
    },
    transaction,
  });
  const now = new Date();
  const emsCall = await models.EmergencyMedicalServiceCall.create(
    {
      dispatchCallNumber,
      startDateTimeLocal: now,
      CreatedById: user.id,
      UpdatedById: user.id,
    },
    { transaction }
  );
  const patient = await models.Patient.create(
    _.merge({}, patientData, {
      EmergencyMedicalServiceCallId: emsCall.id,
      CreatedById: user.id,
      UpdatedById: user.id,
    }),
    { transaction }
  );
  const patientDelivery = await models.PatientDelivery.create(
    {
      AmbulanceId: ambulance.id,
      PatientId: patient.id,
      HospitalId: hospital.id,
      ParamedicUserId: user.id,
      currentDeliveryStatus: deliveryStatus,
      currentDeliveryStatusDateTimeLocal: now,
      etaMinutes,
      CreatedById: user.id,
      UpdatedById: user.id,
    },
    { transaction }
  );
  for (let i = DeliveryStatus.ALL_STATUSES.indexOf(deliveryStatus); i >= 0; i -= 1) {
    // eslint-disable-next-line no-await-in-loop
    await models.PatientDeliveryUpdate.create(
      {
        PatientDeliveryId: patientDelivery.id,
        deliveryStatus: DeliveryStatus.ALL_STATUSES[i],
        deliveryStatusDateTimeLocal: new Date(now.getTime() - i * 10000),
        CreatedById: user.id,
        UpdatedById: user.id,
      },
      { transaction }
    );
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await createRingdown(
        'op.ems.1@c4sf.me',
        'SFFD-1',
        'SF General',
        1,
        {
          age: 30,
          sex: 'MALE',
          emergencyServiceResponseType: 'CODE 2',
          chiefComplaintDescription: 'Fainted while walking home.',
          stableIndicator: true,
          systolicBloodPressure: 120,
          diastolicBloodPressure: 80,
          heartRateBpm: 70,
          respiratoryRate: 24,
          oxygenSaturation: 98,
          lowOxygenResponseType: 'SUPPLEMENTAL OXYGEN',
          supplementalOxygenAmount: 2,
          temperature: 99.4,
          etohSuspectedIndicator: false,
          drugsSuspectedIndicator: true,
          psychIndicator: false,
          combativeBehaviorIndicator: false,
          restraintIndicator: false,
          covid19SuspectedIndicator: true,
          ivIndicator: false,
          otherObservationNotes: 'Needs assistance walking',
        },
        'RINGDOWN SENT',
        10,
        transaction
      );
      await createRingdown(
        'op.ems.2@c4sf.me',
        'SFFD-2',
        'SF General',
        2,
        {
          age: 16,
          sex: 'FEMALE',
          emergencyServiceResponseType: 'CODE 2',
          chiefComplaintDescription: 'Head injury. Loss of consciousness.',
          stableIndicator: true,
        },
        'RINGDOWN RECEIVED',
        6,
        transaction
      );
      await createRingdown(
        'op.ems.3@c4sf.me',
        'SFFD-3',
        'SF General',
        3,
        {
          age: 75,
          sex: 'MALE',
          emergencyServiceResponseType: 'CODE 2',
          chiefComplaintDescription: 'Chest pain. Mild headache.',
          stableIndicator: true,
        },
        'ARRIVED',
        15,
        transaction
      );
      await createRingdown(
        'op.ems.4@c4sf.me',
        'SFFD-4',
        'SF General',
        4,
        {
          age: 30,
          sex: 'MALE',
          emergencyServiceResponseType: 'CODE 2',
          chiefComplaintDescription: 'Fainted while walking home.',
          stableIndicator: true,
        },
        'OFFLOADED',
        12,
        transaction
      );
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
