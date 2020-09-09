'use strict';

/// MUST BE FIRST! set the NODE_ENV to test to disable logging, switch to test db
process.env.NODE_ENV = 'test';

const fixtures = require('sequelize-fixtures');
const path = require('path');

const models = require('../models');

const loadFixtures = async function (files) {
  files = files.map((f) => path.resolve(__dirname, `fixtures/${f}.json`));
  await fixtures.loadFiles(files, models);
};

const resetDatabase = async function () {
  /// clear all test data (order matters due to foreign key relationships)
  await models.sequelize.query(`
    DELETE FROM patient;
    DELETE FROM patientdelivery;
    DELETE FROM ambulance;
    DELETE FROM hospitalstatusupdate;
    DELETE FROM hospitaladministrator;
    DELETE FROM hospital;
    DELETE FROM emergencymedicalservicecall;
    DELETE FROM emergencymedicalserviceprovider;
    DELETE FROM batsuser;
  `);
};

beforeEach(async function () {
  await resetDatabase();
});

after(async function () {
  /// close all db connections
  await models.sequelize.close();
});

module.exports = {
  loadFixtures,
};
