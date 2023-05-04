/* eslint-env mocha */

const assert = require('assert');
const HttpStatus = require('http-status-codes');
const session = require('supertest-session');

const helper = require('../../helper');
const app = require('../../../app');
const nodemailermock = require('nodemailer-mock');

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

    // Call the two-factor authentication endpoint
    await testSession.get('/auth/local/twoFactor').set('Accept', 'application/json');
    const sentMail = nodemailermock.mock.sentMail();
    // Extract authentication code from the sent email
    const regex = /Authentication Code: (\d{6})/;
    const match = regex.exec(sentMail[0].text);
    const authCode = match[1];
    // Submit the authentication code
    await testSession.post('/auth/local/twoFactor').set('Accept', 'application/json').send({ code: authCode });
  });
  after(async () => {
    nodemailermock.mock.reset();
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
