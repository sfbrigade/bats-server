const assert = require('assert');
const fs = require('fs');
const HttpStatus = require('http-status-codes');
const path = require('path');
const session = require('supertest-session');

const helper = require('../../helper');
const app = require('../../../app');
const models = require('../../../models');

describe('/webhooks/sffd', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadFixtures(['organizations', 'users', 'hospitals', 'hospitalUsers']);
    testSession = session(app);
  });

  describe('POST /cad', () => {
    it('creates Ambulance and EmergencyMedicalServiceCall records ', async () => {
      // read sample data
      const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'sffd.cad.json')));
      // post to webhook endpoint
      await testSession.post('/webhooks/sffd/cad').set('Accept', 'application/json').send(data).expect(HttpStatus.OK);

      const ambulances = await models.Ambulance.findAll();
      assert.deepStrictEqual(ambulances.length, 35);

      const emsCalls = await models.EmergencyMedicalServiceCall.findAll();
      assert.deepStrictEqual(emsCalls.length, 92);

      const emsCallsAmbulances = await models.EmergencyMedicalServiceCallAmbulance.findAll();
      assert.deepStrictEqual(emsCallsAmbulances.length, 96);
    });
  });
});
