const assert = require('assert');
const HttpStatus = require('http-status-codes');
const session = require('supertest-session');

const helper = require('../../helper');
const app = require('../../../app');

describe('/api/hospitalstatuses', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadFixtures(['users', 'hospitals', 'hospitalAdministrators', 'hospitalStatusUpdates']);
    testSession = session(app);
    await testSession
      .post('/auth/local/login')
      .set('Accept', 'application/json')
      .send({ username: 'regular.user@example.com', password: 'abcd1234' });
  });

  describe.only('GET /', () => {
    it('returns a list of the latest status updates per hosptial', async () => {
      const response = await testSession
        .get('/api/hospitalstatuses')
        .set('Accept', 'application/json')
        .expect(HttpStatus.OK);
      assert.deepStrictEqual(response.body.length, 2)
      assert.deepStrictEqual(response.body.length, 2)
    });
  });

  describe.skip('POST /', () => {
    // TODO
    it('creates a new hospital status update', async () => {
      await testSession.post('/api/hospitalstatuses').set('Accept', 'application/json').send({}).expect(HttpStatus.CREATED);
    });
  });
});
