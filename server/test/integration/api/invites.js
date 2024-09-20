const assert = require('assert');
const HttpStatus = require('http-status-codes');
const nodemailerMock = require('nodemailer-mock');
const session = require('supertest-session');

const helper = require('../../helper');
const app = require('../../../app');
const models = require('../../../models');

describe('/api/invites', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadFixtures(['organizations', 'users', 'invites']);
    testSession = session(app);
    await testSession
      .post('/auth/local/login')
      .set('Accept', 'application/json')
      .send({ username: 'super.user@example.com', password: 'abcd1234' })
      .expect(HttpStatus.ACCEPTED);
    await helper.twoFactorAuthSession(testSession);
    nodemailerMock.mock.reset();
  });

  describe('GET /', () => {
    it('returns a list of sent invites', async () => {
      const response = await testSession.get('/api/invites').set('Accept', 'application/json').expect(HttpStatus.OK);
      assert.deepStrictEqual(response.body.length, 2);
      assert.deepStrictEqual(response.body[0].lastName, 'User 2');
      assert.deepStrictEqual(response.body[1].lastName, 'User 1');
    });
  });

  describe('POST /', () => {
    it('creates and sends a new Invite', async () => {
      const response = await testSession
        .post('/api/invites')
        .set('Accept', 'application/json')
        .send({
          OrganizationId: '25ffdd7c-b4cf-4ebb-9750-1e628370e13b',
          firstName: 'Invitee',
          lastName: 'Name',
          email: 'invitee.name@test.com',
          message: 'Welcome!',
          isOperationalUser: true,
          isAdminUser: true,
          isSuperUser: false,
        })
        .expect(HttpStatus.CREATED);

      assert(response.body?.id);
      const invite = await models.Invite.findByPk(response.body.id);
      assert(invite);
      assert.deepStrictEqual(invite.OrganizationId, '25ffdd7c-b4cf-4ebb-9750-1e628370e13b');
      assert.deepStrictEqual(invite.firstName, 'Invitee');
      assert.deepStrictEqual(invite.lastName, 'Name');
      assert.deepStrictEqual(invite.email, 'invitee.name@test.com');
      assert.deepStrictEqual(invite.message, 'Welcome!');
      assert.deepStrictEqual(invite.isOperationalUser, true);
      assert.deepStrictEqual(invite.isAdminUser, true);
      assert.deepStrictEqual(invite.isSuperUser, false);
      assert.deepStrictEqual(invite.CreatedById, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');
      assert.deepStrictEqual(invite.UpdatedById, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');

      const emails = nodemailerMock.mock.getSentMail();
      assert.deepStrictEqual(emails.length, 1);
      assert.deepStrictEqual(emails[0].subject, `You've been invited to join Routed`);
      assert.deepStrictEqual(emails[0].to, 'Invitee Name <invitee.name@test.com>');
    });
  });

  describe('GET /:id', () => {
    it('returns an Invite by id', async () => {
      const response = await testSession
        .get('/api/invites/14a500b7-f14c-48cd-b815-3685a8b54370')
        .set('Accept', 'application/json')
        .expect(HttpStatus.OK);
      const data = { ...response.body };
      assert.deepStrictEqual(data, {
        id: '14a500b7-f14c-48cd-b815-3685a8b54370',
        OrganizationId: 'aac13870-f6f3-11ea-adc1-0242ac120002',
        firstName: 'Invited',
        lastName: 'User 1',
        email: 'invited.user.1@test.com',
        message: 'This is an invitation to Invited User 1.',
        isOperationalUser: false,
        isAdminUser: true,
        isSuperUser: false,
        CreatedById: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        createdAt: '2022-01-29T22:58:56.000Z',
        UpdatedById: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        updatedAt: data.updatedAt,
        ResentById: null,
        resentAt: null,
        AcceptedById: null,
        acceptedAt: null,
        RevokedById: null,
        revokedAt: null,
      });
    });
  });

  describe('DELETE /:id', () => {
    it('revokes an Invite by id', async () => {
      await testSession.delete('/api/invites/14a500b7-f14c-48cd-b815-3685a8b54370').set('Accept', 'application/json').expect(HttpStatus.OK);
      const invite = await models.Invite.findByPk('14a500b7-f14c-48cd-b815-3685a8b54370');
      assert(invite.revokedAt);
      assert.deepStrictEqual(invite.RevokedById, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');
    });
  });

  describe('POST /:id/accept', () => {
    it('accepts an Invite by id, creating a new User', async () => {
      const response = await testSession
        .post('/api/invites/14a500b7-f14c-48cd-b815-3685a8b54370/accept')
        .set('Accept', 'application/json')
        .send({
          firstName: 'Accepting',
          lastName: 'User',
          username: 'acceptinguser',
          email: 'accepting.user@test.com',
          password: 'Abcd1234!',
          confirmPassword: 'Abcd1234!',
        })
        .expect(HttpStatus.CREATED);
      const { id } = response.body;
      assert(id);
      assert.deepStrictEqual(response.body, {
        id,
        organization: {
          id: 'aac13870-f6f3-11ea-adc1-0242ac120002',
        },
        firstName: 'Accepting',
        lastName: 'User',
        email: 'accepting.user@test.com',
        isActive: true,
        isAdminUser: true,
        isOperationalUser: false,
        isSuperUser: false,
      });

      const invite = await models.Invite.findByPk('14a500b7-f14c-48cd-b815-3685a8b54370');
      assert(invite.acceptedAt);
      assert.deepStrictEqual(invite.AcceptedById, id);
    });
  });
});
