const HttpStatus = require('http-status-codes');
const session = require('supertest-session');

const helper = require('../../helper');
const app = require('../../../app');

describe.skip('/api/hospitalstatuses', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadFixtures(['users', 'hospitals', 'hospitalAdministrators', 'hospitalStatusUpdates']);
    testSession = session(app);
    await testSession
      .post('/auth/local/login')
      .set('Accept', 'application/json')
      .send({ username: 'regular.user@example.com', password: 'abcd1234' });
  });

  describe.skip('GET /hospitalstatuses', () => {
    // TODO
    it('returns a list of the latest status updates per hosptial', async () => {
      await testSession.get('/api/hospitalstatuses').set('Accept', 'application/json').expect(HttpStatus.OK);
    });
  });

  describe.skip('POST /hospitalstatuses', () => {
    // TODO
    it('creates a new hospital status update', async () => {
      await testSession
        .post('/api/hospitalstatuses')
        .set('Accept', 'application/json')
        .send({})
        .expect(HttpStatus.CREATED);
    });
  });
});
