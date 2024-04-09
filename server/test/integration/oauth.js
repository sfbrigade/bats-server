const assert = require('assert');
const HttpStatus = require('http-status-codes');
const session = require('supertest-session');

const helper = require('../helper');
const app = require('../../app');

describe('/oauth', async () => {
  let testSession = null;
  beforeEach(async () => {
    await helper.loadFixtures(['organizations', 'users', 'clients']);
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
    });
  });
});
