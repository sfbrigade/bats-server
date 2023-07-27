/// MUST BE FIRST! set the NODE_ENV to test to disable logging, switch to test db
process.env.NODE_ENV = 'test';

const fixtures = require('sequelize-fixtures');
const path = require('path');

const models = require('../models');
const nodemailermock = require('nodemailer-mock');

const loadFixtures = async (files) => {
  const filePaths = files.map((f) => path.resolve(__dirname, `fixtures/${f}.json`));
  await models.sequelize.transaction(async (transaction) => {
    await fixtures.loadFiles(filePaths, models, { transaction });
  });
};

const resetDatabase = async () => {
  /// clear all test data (order matters due to foreign key relationships)
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
};

const twoFactorAuthSession = async (testSession) => {
  console.log('Starting two factor authentication');
  // Call the two-factor authentication endpoint
  await testSession.get('/auth/local/twoFactor').set('Accept', 'application/json');
  console.log('Sent two factor authentication request');
  const sentMail = nodemailermock.mock.sentMail();
  // Extract authentication code from the sent email
  const regex = /authentication code is: (\d{6})/;
  const match = regex.exec(sentMail[0].text);
  console.log('Extracted authentication code from email');
  console.log('mail', sentMail[0].text);
  console.log('match', match);
  const authCode = match[1];
  console.log(`Authentication code: ${authCode}`);

  // Submit the authentication code
  await testSession.post('/auth/local/twoFactor').set('Accept', 'application/json').send({ code: authCode });
};

beforeEach(async () => {
  await resetDatabase();
});

// eslint-disable-next-line no-undef
after(async () => {
  /// close all db connections
  await models.sequelize.close();
});

module.exports = {
  loadFixtures,
  twoFactorAuthSession,
};
