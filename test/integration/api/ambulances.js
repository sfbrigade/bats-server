const assert = require('assert');
const HttpStatus = require('http-status-codes');
const session = require('supertest-session');

const helper = require('../../helper');
const app = require('../../../app');

describe('/api/ambulances', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadFixtures(['organizations', 'users', 'ambulances']);

    testSession = session(app);
    await testSession
      .post('/auth/local/login')
      .set('Accept', 'application/json')
      .send({ username: 'sutter.operational@example.com', password: 'abcd1234' });
  });

  describe('GET /identifiers', () => {
    it('returns a list of ambulance identifiers filtered by organizationId', async () => {
      const orgId = '1dd0dfd7-562e-48db-ae78-31b9136d3e15';
      const response = await testSession
        .get(`/api/ambulances/identifiers?organizationId=${orgId}`)
        .set('Accept', 'application/json')
        .expect(HttpStatus.OK);

      const { ambulanceIdentifiers } = response.body;
      assert.deepStrictEqual(ambulanceIdentifiers.length, 2);
      assert(ambulanceIdentifiers.includes('SFFD-1'));
      assert(ambulanceIdentifiers.includes('SFFD-2'));
    });
  });
});
