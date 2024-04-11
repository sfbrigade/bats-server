const assert = require('assert');
const HttpStatus = require('http-status-codes');
const session = require('supertest-session');

const helper = require('../helper');
const app = require('../../app');
const models = require('../../models');

describe('/oauth', async () => {
  let testSession = null;
  beforeEach(async () => {
    await helper.loadFixtures(['organizations', 'users', 'clients', 'tokens']);
    testSession = session(app);
  });

  describe('POST /token', () => {
    it('should return an access token for a client credentials request', async () => {
      const response = await testSession
        .post('/oauth/token')
        .type('form')
        .send({
          grant_type: 'client_credentials',
          client_id: 'sVKBATjgnoWeQDRfUraw',
          client_secret: 'abcdefghijklmnopqrstuvwxyz01234567891234',
        })
        .expect(HttpStatus.OK);

      assert.ok(response.body.access_token);
      assert.ok(response.body.expires_in);
      assert.deepStrictEqual(response.body.token_type, 'Bearer');

      const token = await models.Token.findOne({ where: { accessToken: response.body.access_token }, rejectOnEmpty: true });
      assert.deepStrictEqual(token.userId, '449b1f54-7583-417c-8c25-8da7dde65f6d');
    });
  });

  it('should allow authenticated access with a valid bearer access token', async () => {
    await testSession
      .get('/api/users/me')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer 8ac60efe792e63cc977f18aa6191f70')
      .expect(HttpStatus.OK);
  });

  it('should not allow authenticated access with an expired bearer access token', async () => {
    await testSession
      .get('/api/users/me')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer 8acb1d4d7da2665278a2c0c0dcbad578d')
      .expect(HttpStatus.UNAUTHORIZED);

    // token is deleted
    const token = await models.Token.findOne({ where: { accessToken: '8acb1d4d7da2665278a2c0c0dcbad578d' } });
    assert.deepStrictEqual(token, null);
  });
});
