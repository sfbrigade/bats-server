'use strict'

/// MUST BE FIRST! set the NODE_ENV to test to disable logging, switch to test db
process.env.NODE_ENV = 'test';

const models = require('../models');

const resetDatabase = async function() {
  /// clear all test data (order matters due to foreign key relationships)
  await models.sequelize.query(`
    DELETE FROM patient;
    DELETE FROM patientdelivery;
    DELETE FROM ambulance;
    DELETE FROM hospitaladministrator;
    DELETE FROM hospitalstatusupdate;
    DELETE FROM hospital;
    DELETE FROM emergencymedicalservicecall;
    DELETE FROM emergencymedicalserviceprovider;
  `);
};

beforeEach(async function() {
  await resetDatabase();
});

after(async function() {
  /// close all db connections
  await models.sequelize.close();
});
