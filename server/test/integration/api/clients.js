const assert = require('assert');
const HttpStatus = require('http-status-codes');
const session = require('supertest-session');

const helper = require('../../helper');
const app = require('../../../app');
const models = require('../../../models');

describe('/api/clients', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadFixtures(['organizations', 'users', 'clients']);
    testSession = session(app);
    await testSession
      .post('/auth/local/login')
      .send({ username: 'super.user@example.com', password: 'abcd1234' })
      .expect(HttpStatus.ACCEPTED);
    // since company in fixture has mFa enabled, signing in would require twoFactor
    await helper.twoFactorAuthSession(testSession);
  });

  describe('GET /', () => {
    it('returns a paginated list of Clients', async () => {
      const response = await testSession.get('/api/clients').expect(HttpStatus.OK);
      assert.deepStrictEqual(response.body.length, 2);
    });
  });

  describe('POST /', () => {
    it('creates a new Client', async () => {
      const response = await testSession
        .post('/api/clients')
        .set('Accept', 'application/json')
        .send({
          name: 'Test Client',
          UserEmail: 'sutter.admin@example.com',
          redirectUri: 'http://localhost:3000/callback',
        })
        .expect(HttpStatus.CREATED);

      assert(response.body.id);
      const client = await models.Client.findByPk(response.body.id);
      assert.deepStrictEqual(client.name, 'Test Client');
      assert.deepStrictEqual(client.UserId, 'a950fed4-d996-4a41-a275-1cc4852d7664');
      assert.deepStrictEqual(client.redirectUri, 'http://localhost:3000/callback');
      assert(client.authenticate(response.body.clientSecret));
    });
  });

  describe('GET /:id', () => {
    it('returns an existing Client', async () => {
      const response = await testSession
        .get('/api/clients/b5856463-a1ac-4276-8d84-61a12b7b0c79')
        .set('Accept', 'application/json')
        .expect(HttpStatus.OK);
      const data = response.body;
      assert.deepStrictEqual(data, {
        id: 'b5856463-a1ac-4276-8d84-61a12b7b0c79',
        name: 'Test Client 1',
        clientId: 'sVKBATjgnoWeQDRfUraw',
        UserId: '449b1f54-7583-417c-8c25-8da7dde65f6d',
        UserEmail: 'sutter.operational@example.com',
        User: {
          id: '449b1f54-7583-417c-8c25-8da7dde65f6d',
          organization: {
            id: '25ffdd7c-b4cf-4ebb-9750-1e628370e13b',
          },
          firstName: 'Sutter',
          lastName: 'Operational',
          email: 'sutter.operational@example.com',
          isActive: true,
          isOperationalUser: true,
          isAdminUser: false,
          isSuperUser: false,
        },
        redirectUri: null,
        createdAt: '2020-04-07T19:53:42.434Z',
        updatedAt: data.updatedAt,
        CreatedById: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        UpdatedById: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      });
    });
  });

  describe('DELETE /:id', () => {
    it('deletes an existing Client', async () => {
      await testSession.delete('/api/clients/9db6b601-13fc-4755-906a-c532ce319be0').set('Accept', 'application/json').expect(HttpStatus.OK);
      const client = await models.Client.findByPk('9db6b601-13fc-4755-906a-c532ce319be0');
      assert.deepStrictEqual(client, null);
    });
  });

  describe('PATCH /:id', () => {
    it('updates an existing Client', async () => {
      const response = await testSession
        .patch('/api/clients/9db6b601-13fc-4755-906a-c532ce319be0')
        .set('Accept', 'application/json')
        .send({
          name: 'Renamed Client',
          UserEmail: 'sffd.paramedic@example.com',
          redirectUri: 'http://localhost:3000/renamedcallback',
        })
        .expect(HttpStatus.OK);
      const client = await models.Client.findByPk(response.body.id);
      assert.deepStrictEqual(client.name, 'Renamed Client');
      assert.deepStrictEqual(client.UserId, '6737fc42-f815-460f-888a-10435af12f08');
      assert.deepStrictEqual(client.redirectUri, 'http://localhost:3000/renamedcallback');
    });
  });

  describe('PATCH /:id/generate', () => {
    it('regenerates an existing Client id and secret', async () => {
      const client = await models.Client.findByPk('9db6b601-13fc-4755-906a-c532ce319be0');
      const oldClientId = client.clientId;

      const response = await testSession
        .patch('/api/clients/9db6b601-13fc-4755-906a-c532ce319be0/regenerate')
        .set('Accept', 'application/json')
        .expect(HttpStatus.OK);

      await client.reload();
      assert.notDeepStrictEqual(client.clientId, oldClientId);
      assert(client.authenticate(response.body.clientSecret));
    });
  });
});
