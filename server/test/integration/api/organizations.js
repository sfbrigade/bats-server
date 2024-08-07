const assert = require('assert');
const HttpStatus = require('http-status-codes');
const session = require('supertest-session');

const helper = require('../../helper');
const models = require('../../../models');
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
      .expect(HttpStatus.ACCEPTED);
    // since company in fixture has mFa enabled, signing in would require twoFactor
    await helper.twoFactorAuthSession(testSession);
  });

  describe('POST /', () => {
    it('creates a new Organization', async () => {
      const response = await testSession
        .post('/api/organizations')
        .set('Accept', 'application/json')
        .send({
          name: 'Kaiser Permanente',
          type: 'HEALTHCARE',
          state: '06',
          stateUniqueId: '',
          timeZone: 'America/Los_Angeles',
          isActive: true,
        })
        .expect(HttpStatus.CREATED);

      const data = response.body;
      assert.ok(data.id);
      assert.deepStrictEqual(data.name, 'Kaiser Permanente');
      assert.deepStrictEqual(data.type, 'HEALTHCARE');
      assert.deepStrictEqual(data.state, '06');
      assert.deepStrictEqual(data.stateUniqueId, null);
      assert.deepStrictEqual(data.timeZone, 'America/Los_Angeles');
      assert.deepStrictEqual(data.isActive, true);

      const record = await models.Organization.findByPk(data.id);
      assert.deepStrictEqual(record.name, 'Kaiser Permanente');
      assert.deepStrictEqual(record.type, 'HEALTHCARE');
      assert.deepStrictEqual(record.state, '06');
      assert.deepStrictEqual(record.stateUniqueId, null);
      assert.deepStrictEqual(record.timeZone, 'America/Los_Angeles');
      assert.deepStrictEqual(record.isActive, true);
    });
  });

  describe('PATCH /:id', () => {
    it('updates an existing Organization record', async () => {
      const response = await testSession
        .patch('/api/organizations/0b01d3a3-3a8c-40a9-b07a-b360f256d5fc')
        .set('Accept', 'application/json')
        .send({ name: 'UC San Francisco Health', stateUniqueId: '' })
        .expect(HttpStatus.OK);
      const { body: data } = response;
      assert.deepStrictEqual(data.name, 'UC San Francisco Health');
      assert.deepStrictEqual(data.stateUniqueId, null);
    });

    it('turns on mfa for an organization', async () => {
      const orgId = '25ffdd7c-b4cf-4ebb-9750-1e628370e13b';

      const orgBefore = await models.Organization.findByPk(orgId);
      assert.deepStrictEqual(orgBefore.isMfaEnabled, false);

      const response = await testSession
        .patch(`/api/organizations/${orgId}`)
        .set('Accept', 'application/json')
        .send({ isMfaEnabled: true })
        .expect(HttpStatus.OK);
      assert.deepStrictEqual(response.body.isMfaEnabled, true);

      const orgAfter = await models.Organization.findByPk(orgId);
      assert.deepStrictEqual(orgAfter.isMfaEnabled, true);
    });

    it('turns off mfa for an organization', async () => {
      const orgId = 'aac13870-f6f3-11ea-adc1-0242ac120002';

      const orgBefore = await models.Organization.findByPk(orgId);
      assert.deepStrictEqual(orgBefore.isMfaEnabled, true);

      const response = await testSession
        .patch(`/api/organizations/${orgId}`)
        .set('Accept', 'application/json')
        .send({ isMfaEnabled: false })
        .expect(HttpStatus.OK);
      assert.deepStrictEqual(response.body.isMfaEnabled, false);

      const orgAfter = await models.Organization.findByPk(orgId);
      assert.deepStrictEqual(orgAfter.isMfaEnabled, false);
    });
  });
});
