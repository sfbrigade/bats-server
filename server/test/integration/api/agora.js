/* eslint-env mocha */

const assert = require('assert');
const HttpStatus = require('http-status-codes');
const session = require('supertest-session');

const helper = require('../../helper');
const app = require('../../../app');

describe('/api/agora', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadFixtures(['organizations', 'users', 'ambulances']);
    testSession = session(app);
    await testSession
      .post('/auth/local/login')
      .set('Accept', 'application/json')
      .send({ username: 'sutter.operational@example.com', password: 'abcd1234' })
      .expect(HttpStatus.OK);
  });

  describe('GET /rtm-token', () => {
    it('returns a token', async () => {
      const response = await testSession.get(`/api/agora/rtm-token`).set('Accept', 'application/json').expect(HttpStatus.OK);
      const { token } = response.body;
      assert.ok(token);
    });
  });

  describe('GET /rtc-token', () => {
    it('returns a token', async () => {
      const response = await testSession
        .get(`/api/agora/rtc-token?channelName=8c62df8c-953b-4a7a-846c-78627a941161`)
        .set('Accept', 'application/json')
        .expect(HttpStatus.OK);
      const { token } = response.body;
      assert.ok(token);
    });
  });
});
