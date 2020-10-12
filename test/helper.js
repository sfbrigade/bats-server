/// MUST BE FIRST! set the NODE_ENV to test to disable logging, switch to test db
process.env.NODE_ENV = 'test';

const fixtures = require('sequelize-fixtures');
const path = require('path');

const models = require('../models');

const loadFixtures = async (files) => {
  const filePaths = files.map((f) => path.resolve(__dirname, `fixtures/${f}.json`));
  await models.sequelize.transaction(async (transaction) => {
    /// special case handling: create the first org and superuser manually, due to the circular references
    // const org = await models.Organization.create({
    //   id: 'f19c4a0d-227c-4929-a223-5da89f7c1d52',
    //   name: 'Code for San Francisco',
    //   type: 'C4SF',
    // });
    // const superuser = await models.User.create({
    //   id: 'df08937c-3db7-45f6-906c-d5226c56f4f6'
    // });
    await fixtures.loadFiles(filePaths, models, { transaction });
  });
};

const resetDatabase = async () => {
  /// clear all test data (order matters due to foreign key relationships)
  await models.sequelize.query(`
    DELETE FROM patientdelivery;
    DELETE FROM patient;
    DELETE FROM ambulance;
    DELETE FROM hospitalstatusupdate;
    DELETE FROM hospitaluser;
    DELETE FROM hospital;
    DELETE FROM emergencymedicalservicecall;
    DELETE FROM organization;
    DELETE FROM batsuser;
  `);
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
};
