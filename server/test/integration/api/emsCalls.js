const assert = require('assert');
const HttpStatus = require('http-status-codes');
const session = require('supertest-session');

const helper = require('../../helper');
const app = require('../../../app');

describe('/api/emscalls', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadFixtures([
      'organizations',
      'users',
      'ambulances',
      'emergencyMedicalServiceCalls',
      'emergencyMedicalServiceCallAmbulances',
      'hospitals',
      'patients',
    ]);

    testSession = session(app);
    await testSession
      .post('/auth/local/login')
      .set('Accept', 'application/json')
      .send({ username: 'sutter.operational@example.com', password: 'abcd1234' });
  });

  describe('GET /dispatch-call-numbers', () => {
    it('returns a sorted list of EmergencyMedicalServiceCall dispatchCallNumbers filtered by ambulanceIdentifier', async () => {
      const ambulanceIdentifier = 'SFFD-1';
      const response = await testSession
        .get(`/api/emscalls/dispatch-call-numbers?ambulanceIdentifier=${ambulanceIdentifier}`)
        .set('Accept', 'application/json')
        .expect(HttpStatus.OK);

      const { dispatchCallNumbers } = response.body;
      assert.deepStrictEqual(dispatchCallNumbers.length, 3);
      // should be sorted descending
      assert(dispatchCallNumbers[0] === 911);
      assert(dispatchCallNumbers[1] === 333);
      assert(dispatchCallNumbers[2] === 111);
    });
  });
});
