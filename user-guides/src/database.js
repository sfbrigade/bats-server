// get the .env from the root of the project, above the current /user-guides directory.  we have to make sure this is done before loading
// the models package, which calls sequelize, which pulls data from process.env.
require('dotenv').config({ path: '../.env' });

const _ = require('../../server/node_modules/lodash');
const models = require('../../server/models');
const { DeliveryStatus } = require('../../shared/constants');

let callNumber = 0;
const getCallNumber = () => ++callNumber;
const getRandomETA = () => Math.floor(5 + Math.random() * 21);

async function resetAll() {
  // clear all test data (order matters due to foreign key relationships)
  await models.sequelize.query(`
    DELETE FROM patientdeliveryupdate;
    DELETE FROM patientdelivery;
    DELETE FROM patient;
    DELETE FROM emergencymedicalservicecallambulance;
    DELETE FROM ambulance;
    DELETE FROM hospitalstatusupdate;
    DELETE FROM hospitaluser;
    DELETE FROM hospital;
    DELETE FROM emergencymedicalservicecall;
    DELETE FROM organization;
    DELETE FROM batsuser;
  `);
}

async function resetRingdowns() {
  // clear just the ringdown-related tables
  await models.sequelize.query(`
    DELETE FROM patientdeliveryupdate;
    DELETE FROM patientdelivery;
    DELETE FROM patient;
    DELETE FROM emergencymedicalservicecallambulance;
    DELETE FROM emergencymedicalservicecall;
  `);
}

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

async function addRingdown(data) {
  const {
    user: { email, unit: ambulanceIdentifier },
    call: {
      number: dispatchCallNumber = getCallNumber(),
      status: deliveryStatus = DeliveryStatus.RINGDOWN_SENT,
      destination: hospitalName,
      eta: etaMinutes = getRandomETA(),
    },
    patient: patientData,
  } = data;

  await models.sequelize.transaction(async (transaction) => {
    await createRingdown(
      email,
      ambulanceIdentifier,
      hospitalName,
      dispatchCallNumber,
      patientData,
      deliveryStatus,
      etaMinutes,
      transaction
    );
  });
}

module.exports = {
  resetAll,
  resetRingdowns,
  addRingdown,
  DeliveryStatus,
};
