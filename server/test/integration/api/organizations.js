const assert = require('assert');
const HttpStatus = require('http-status-codes');
const session = require('supertest-session');

const helper = require('../../helper');
const models = require('../../../models');
const app = require('../../../app');

describe('/api/organizations', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadFixtures(['organizations', 'users', 'assignments']);
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

  describe('PUT /:id', () => {
    it('updates an existing Organization record', async () => {
      const response = await testSession
        .put('/api/organizations/0b01d3a3-3a8c-40a9-b07a-b360f256d5fc')
        .set('Accept', 'application/json')
        .send({
          name: 'UC San Francisco Medical Center',
          type: 'HEALTHCARE',
          state: '06',
          timeZone: 'America/Los_Angeles',
          isActive: true,
        })
        .expect(HttpStatus.OK);

      const data = response.body;
      assert.deepStrictEqual(data.name, 'UC San Francisco Medical Center');
      assert.deepStrictEqual(data.type, 'HEALTHCARE');
      assert.deepStrictEqual(data.state, '06');
      assert.deepStrictEqual(data.stateUniqueId, null);
      assert.deepStrictEqual(data.timeZone, 'America/Los_Angeles');
      assert.deepStrictEqual(data.isActive, true);

      const record = await models.Organization.findByPk(data.id);
      assert.deepStrictEqual(record.name, 'UC San Francisco Medical Center');
      assert.deepStrictEqual(record.type, 'HEALTHCARE');
      assert.deepStrictEqual(record.state, '06');
      assert.deepStrictEqual(record.stateUniqueId, null);
      assert.deepStrictEqual(record.timeZone, 'America/Los_Angeles');
      assert.deepStrictEqual(record.isActive, true);
    });

    it('creates a new Organization record if id does not exist', async () => {
      const newId = '11111111-1111-1111-1111-111111111111';
      const response = await testSession
        .put(`/api/organizations/${newId}`)
        .set('Accept', 'application/json')
        .send({
          name: 'New Organization',
          type: 'EMS',
          state: '06',
          stateUniqueId: 'S38-99999',
          timeZone: 'America/Los_Angeles',
          isActive: true,
        })
        .expect(HttpStatus.CREATED);

      const data = response.body;
      assert.deepStrictEqual(data.id, newId);
      assert.deepStrictEqual(data.name, 'New Organization');
      assert.deepStrictEqual(data.type, 'EMS');
      assert.deepStrictEqual(data.state, '06');
      assert.deepStrictEqual(data.stateUniqueId, 'S38-99999');
      assert.deepStrictEqual(data.timeZone, 'America/Los_Angeles');
      assert.deepStrictEqual(data.isActive, true);

      const record = await models.Organization.findByPk(newId);
      assert.ok(record);
      assert.deepStrictEqual(record.name, 'New Organization');
      assert.deepStrictEqual(record.type, 'EMS');
      assert.deepStrictEqual(record.state, '06');
      assert.deepStrictEqual(record.stateUniqueId, 'S38-99999');
      assert.deepStrictEqual(record.timeZone, 'America/Los_Angeles');
      assert.deepStrictEqual(record.isActive, true);
    });

    it('sets stateUniqueId to null for non-EMS organizations', async () => {
      const response = await testSession
        .put('/api/organizations/0b01d3a3-3a8c-40a9-b07a-b360f256d5fc')
        .set('Accept', 'application/json')
        .send({
          name: 'UCSF Health',
          type: 'HEALTHCARE',
          state: '06',
          stateUniqueId: 'SHOULD-BE-NULL',
          timeZone: 'America/Los_Angeles',
          isActive: true,
        })
        .expect(HttpStatus.OK);

      const data = response.body;
      assert.deepStrictEqual(data.stateUniqueId, null);

      const record = await models.Organization.findByPk(data.id);
      assert.deepStrictEqual(record.stateUniqueId, null);
    });
  });

  describe('POST /:id/assign', () => {
    it('assigns an organization to another organization', async () => {
      const response = await testSession
        .post('/api/organizations/50ff83e4-c00d-43b2-a4c4-f7b616fbd972/assign')
        .set('Accept', 'application/json')
        .send({ FromOrganizationId: '0b01d3a3-3a8c-40a9-b07a-b360f256d5fc' })
        .expect(HttpStatus.CREATED);

      const data = response.body;
      assert.deepStrictEqual(data.FromOrganizationId, '0b01d3a3-3a8c-40a9-b07a-b360f256d5fc');
      assert.deepStrictEqual(data.ToOrganizationId, '50ff83e4-c00d-43b2-a4c4-f7b616fbd972');

      const assignment = await models.Assignment.findByPk(data.id);
      assert.deepStrictEqual(assignment.FromOrganizationId, '0b01d3a3-3a8c-40a9-b07a-b360f256d5fc');
      assert.deepStrictEqual(assignment.ToOrganizationId, '50ff83e4-c00d-43b2-a4c4-f7b616fbd972');
    });

    it('assigns an organization to another organization by state and stateUniqueId', async () => {
      const response = await testSession
        .post('/api/organizations/50ff83e4-c00d-43b2-a4c4-f7b616fbd972/assign')
        .set('Accept', 'application/json')
        .send({ state: '06', stateUniqueId: 'S38-50827' })
        .expect(HttpStatus.CREATED);

      const data = response.body;
      assert.deepStrictEqual(data.FromOrganizationId, '1dd0dfd7-562e-48db-ae78-31b9136d3e15');
      assert.deepStrictEqual(data.ToOrganizationId, '50ff83e4-c00d-43b2-a4c4-f7b616fbd972');

      const assignment = await models.Assignment.findByPk(data.id);
      assert.deepStrictEqual(assignment.FromOrganizationId, '1dd0dfd7-562e-48db-ae78-31b9136d3e15');
      assert.deepStrictEqual(assignment.ToOrganizationId, '50ff83e4-c00d-43b2-a4c4-f7b616fbd972');
    });
  });

  describe('DELETE /:id/assign', () => {
    it('deletes an assignment', async () => {
      await testSession
        .delete('/api/organizations/50ff83e4-c00d-43b2-a4c4-f7b616fbd972/assign?FromOrganizationId=7c9023ff-dd16-4e87-823a-80567a7b834a')
        .set('Accept', 'application/json')
        .expect(HttpStatus.NO_CONTENT);

      const assignment = await models.Assignment.findByPk('de6dbb62-b601-4969-83db-22a5907a6e57');
      assert.ok(assignment.deletedAt);
      assert.deepStrictEqual(assignment.DeletedById, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');
    });

    it('deletes an assignment by state and stateUniqueId', async () => {
      await testSession
        .delete('/api/organizations/50ff83e4-c00d-43b2-a4c4-f7b616fbd972/assign?state=06&stateUniqueId=S38-50088')
        .set('Accept', 'application/json')
        .expect(HttpStatus.NO_CONTENT);

      const assignment = await models.Assignment.findByPk('de6dbb62-b601-4969-83db-22a5907a6e57');
      assert.ok(assignment.deletedAt);
      assert.deepStrictEqual(assignment.DeletedById, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');
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
