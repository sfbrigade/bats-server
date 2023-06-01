const assert = require('assert');
const HttpStatus = require('http-status-codes');
const session = require('supertest-session');
const organizations = require('../../fixtures/organizations.json');
const models = require('../../../models');
const helper = require('../../helper');
const app = require('../../../app');

describe('/api/organizations', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadFixtures(['organizations', 'users']);
    testSession = session(app);
    /// log in as a superuser
    await testSession
      .post('/auth/local/login')
      .set('Accept', 'application/json')
      .send({ username: 'super.user@example.com', password: 'abcd1234' })
      .expect(HttpStatus.OK);
  });

  describe('PATCH/', () => {
    it('turns on mfa for an organization', async () => {
      const orgId = "25ffdd7c-b4cf-4ebb-9750-1e628370e13b";

      const orgBefore = await models.Organization.findByPk(orgId);
      assert.deepStrictEqual(orgBefore.isMfaEnabled, false); 

      /// patch an organization
      const response = await testSession.patch(`/api/organizations/${orgId}`).set('Accept', 'application/json').send({isMfaEnabled:true}).expect(HttpStatus.OK);
      assert.deepStrictEqual(response.body.isMfaEnabled, true);

      // check the model directly as well. Also seems like we confifyure to test dbb from the helpers require
      const orgAfter = await models.Organization.findByPk(orgId);
      assert.deepStrictEqual(orgAfter.isMfaEnabled, true);
    });

    it('turns off mfa for an organization', async () => {
      const orgId = "aac13870-f6f3-11ea-adc1-0242ac120002";

      const orgBefore = await models.Organization.findByPk(orgId);
      assert.deepStrictEqual(orgBefore.isMfaEnabled, true); 

     // patch an organization
      const response = await testSession.patch(`/api/organizations/${orgId}`).set('Accept', 'application/json').send({isMfaEnabled:false}).expect(HttpStatus.OK);
      assert.deepStrictEqual(response.body.isMfaEnabled, false);

      const orgAfter = await models.Organization.findByPk(orgId);
      assert.deepStrictEqual(orgAfter.isMfaEnabled, false);
    });
  });
});
