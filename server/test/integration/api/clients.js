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
          UserId: 'a950fed4-d996-4a41-a275-1cc4852d7664',
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
        .get('/api/clients/9db6b601-13fc-4755-906a-c532ce319be0')
        .set('Accept', 'application/json')
        .expect(HttpStatus.OK);
      const data = response.body;
      delete data.updatedAt;
      assert.deepStrictEqual(data, {
        id: '9db6b601-13fc-4755-906a-c532ce319be0',
        name: 'Test Client 2',
        User: null,
        UserId: null,
        clientId: 'R7M6UhUuKq76aYtcdbr5',
        redirectUri: 'http://localhost:3000/callback',
        CreatedById: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        UpdatedById: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        createdAt: '2020-04-07T19:53:42.434Z',
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
          UserId: '6737fc42-f815-460f-888a-10435af12f08',
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
