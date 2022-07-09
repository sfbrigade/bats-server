const assert = require('assert');
const HttpStatus = require('http-status-codes');
const session = require('supertest-session');

const helper = require('../../helper');
const app = require('../../../app');

describe('/api/users', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadFixtures(['organizations', 'users', 'hospitals', 'hospitalUsers']);
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
      const response = await testSession.get('/api/users').set('Accept', 'application/json').expect(HttpStatus.OK);
      assert(response.body?.length, 2);
    });

    it('returns forbidden to a non-superuser', async () => {
      /// log in as a non-superuser
      await testSession
        .post('/auth/local/login')
        .set('Accept', 'application/json')
        .send({ username: 'sutter.operational@example.com', password: 'abcd1234' })
        .expect(HttpStatus.OK);

      /// request user list
      await testSession.get('/api/users').set('Accept', 'application/json').expect(HttpStatus.FORBIDDEN);
    });
  });

  describe('GET /me', () => {
    it('returns the logged-in users info', async () => {
      await testSession
        .post('/auth/local/login')
        .set('Accept', 'application/json')
        .send({ username: 'sutter.operational@example.com', password: 'abcd1234' })
        .expect(HttpStatus.OK);
      const response = await testSession.get('/api/users/me').set('Accept', 'application/json').expect(HttpStatus.OK);
      assert.deepStrictEqual(response.body, {
        id: '449b1f54-7583-417c-8c25-8da7dde65f6d',
        firstName: 'Sutter',
        lastName: 'Operational',
        email: 'sutter.operational@example.com',
        isActive: true,
        isAdminUser: false,
        isOperationalUser: true,
        isSuperUser: false,
        organization: {
          id: '25ffdd7c-b4cf-4ebb-9750-1e628370e13b',
          name: 'Sutter Health',
          type: 'HEALTHCARE',
          timeZoneIsoCode: 'PST',
          isActive: true,
        },
        activeHospitals: [
          {
            isActive: true,
            isRingdownUser: true,
            isInfoUser: true,
            hospital: {
              id: '7f666fe4-dbdd-4c7f-ab44-d9157379a680',
              name: 'CPMC Davies Campus',
              state: '06',
              stateFacilityCode: '20048',
              sortSequenceNumber: 2,
              isActive: true,
            },
          },
        ],
      });
    });
  });
});
