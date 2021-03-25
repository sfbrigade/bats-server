const assert = require('assert');
const HttpStatus = require('http-status-codes');
const session = require('supertest-session');

const helper = require('../../helper');
const app = require('../../../app');

describe('/api/hospitalstatuses', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadFixtures([
      'users',
      'organizations',
      'hospitals',
      'hospitalUsers',
      'hospitalStatusUpdates',
      'ambulances',
      'emergencyMedicalServiceCalls',
      'patients',
      'patientDeliveries',
      'patientDeliveryUpdates',
    ]);
    testSession = session(app);
    await testSession
      .post('/auth/local/login')
      .set('Accept', 'application/json')
      .send({ username: 'sutter.operational@example.com', password: 'abcd1234' });
  });

  describe('GET /', () => {
    it('returns a list of the latest status updates per hosptial', async () => {
      const response = await testSession.get('/api/hospitalstatuses').set('Accept', 'application/json').expect(HttpStatus.OK);

      assert.deepStrictEqual(response.body.length, 2);

      const sutterHospital = response.body[0];
      assert(sutterHospital.id);
      assert(sutterHospital.updateDateTimeLocal);
      assert.deepStrictEqual(sutterHospital.openEdBedCount, 0);
      assert.deepStrictEqual(sutterHospital.divertStatusIndicator, true);
      assert.deepStrictEqual(sutterHospital.edAdminUserId, '449b1f54-7583-417c-8c25-8da7dde65f6d');
      assert.deepStrictEqual(sutterHospital.hospital.ambulancesEnRoute, 2);
      assert.deepStrictEqual(sutterHospital.hospital.ambulancesOffloading, 0);
      assert.deepStrictEqual(sutterHospital.createdById, '449b1f54-7583-417c-8c25-8da7dde65f6d');
      assert.deepStrictEqual(sutterHospital.updatedById, '449b1f54-7583-417c-8c25-8da7dde65f6d');

      const cpmcHospital = response.body[1];
      assert(cpmcHospital.id);
      assert(cpmcHospital.updateDateTimeLocal);
      assert.deepStrictEqual(cpmcHospital.openEdBedCount, 10);
      assert.deepStrictEqual(cpmcHospital.divertStatusIndicator, false);
      assert.deepStrictEqual(cpmcHospital.hospital.ambulancesEnRoute, 1);
      assert.deepStrictEqual(cpmcHospital.hospital.ambulancesOffloading, 1);
      assert.deepStrictEqual(cpmcHospital.edAdminUserId, '449b1f54-7583-417c-8c25-8da7dde65f6d');
      assert.deepStrictEqual(cpmcHospital.createdById, '449b1f54-7583-417c-8c25-8da7dde65f6d');
      assert.deepStrictEqual(cpmcHospital.updatedById, '449b1f54-7583-417c-8c25-8da7dde65f6d');
    });
  });

  describe('POST /', () => {
    it('creates a new hospital status update', async () => {
      const response = await testSession
        .post('/api/hospitalstatuses')
        .set('Accept', 'application/json')
        .send({
          hospitalId: '7f666fe4-dbdd-4c7f-ab44-d9157379a680',
          openEdBedCount: 5,
          openPsychBedCount: 3,
          divertStatusIndicator: false,
        })
        .expect(HttpStatus.CREATED);

      assert(response.body.id);
      assert.deepStrictEqual(response.body.hospital.id, '7f666fe4-dbdd-4c7f-ab44-d9157379a680');
      assert.deepStrictEqual(response.body.openEdBedCount, 5);
      assert.deepStrictEqual(response.body.openPsychBedCount, 3);
      assert.deepStrictEqual(response.body.divertStatusIndicator, false);
      assert.deepStrictEqual(response.body.edAdminUserId, '449b1f54-7583-417c-8c25-8da7dde65f6d');
      assert.deepStrictEqual(response.body.createdById, '449b1f54-7583-417c-8c25-8da7dde65f6d');
      assert.deepStrictEqual(response.body.updatedById, '449b1f54-7583-417c-8c25-8da7dde65f6d');
    });
  });
});
