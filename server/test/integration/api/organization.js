const assert = require('assert');
const HttpStatus = require('http-status-codes');
const session = require('supertest-session');

const helper = require('../../helper');
const app = require('../../../app');


describe('/api/organization', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadFixtures(['organizations', 'users', 'hospitals', 'hospitalUsers']);
    testSession = session(app);
  });

  describe('PATCH/', () => {
    it('returns an organization with mfa enabled', async () => {
      /// log in as a superuser
      await testSession
        .post('/auth/local/login')
        .set('Accept', 'application/json')
        .send({ username: 'super.user@example.com', password: 'abcd1234' })
        .expect(HttpStatus.OK);

      /// patch an organizations
      const response = await testSession.patch('/api/organization/25ffdd7c-b4cf-4ebb-9750-1e628370e13b').set('Accept', 'application/json').send({isMfaEnabled:true}).expect(HttpStatus.OK);
      assert(response.body?.length, 2);
    });

  });
});