const assert = require('assert');
const HttpStatus = require('http-status-codes');
const session = require('supertest-session');

const helper = require('../../helper');
const app = require('../../../app');

describe('/api/users', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadFixtures(['users']);
    testSession = session(app);
  });

  describe('GET /', () => {
    it('returns a list of users to a superuser', async () => {
      /// log in as a superuser
      await testSession
        .post('/auth/local/login')
        .set('Accept', 'application/json')
        .send({ username: 'super.user@example.com', password: 'abcd1234' })
        .expect(HttpStatus.OK);

      /// request user list
      const response = await testSession
        .get('/api/users')
        .set('Accept', 'application/json')
        .expect(HttpStatus.OK);
      assert(response.body?.length, 2);
    });

    it('returns forbidden to a non-superuser', async () => {
      /// log in as a non-superuser
      await testSession
        .post('/auth/local/login')
        .set('Accept', 'application/json')
        .send({ username: 'regular.user@example.com', password: 'abcd1234' })
        .expect(HttpStatus.OK);

      /// request user list
      await testSession
        .get('/api/users')
        .set('Accept', 'application/json')
        .expect(HttpStatus.FORBIDDEN);
    });
  });
});
