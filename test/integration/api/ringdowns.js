const HttpStatus = require('http-status-codes');
const session = require('supertest-session');

const helper = require('../../helper');
const app = require('../../../app');

describe('/api/ringdowns', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadFixtures([
      'users',
      'hospitals',
      'hospitalAdministrators',
      'hospitalStatusUpdates',
      'emergencyMedicalServiceCalls',
      'patients',
      'emergencyMedicalServiceProdiers',
      'ambulances',
      'patientDeliveries',
    ]);
    testSession = session(app);
    await testSession
      .post('/auth/local/login')
      .set('Accept', 'application/json')
      .send({ username: 'regular.user@example.com', password: 'abcd1234' });
  });

  describe('GET /ringdowns', () => {
    it('returns a list of all active ringdowns', async () => {
      await testSession
        .get('/api/ringdowns')
        .set('Accept', 'application/json')
        .expect(HttpStatus.OK);
      // TODO expect a list of ringdowns
    });

    it('returns a returns a list of active ringdowns filtered by hospital', async () => {
      await testSession
        .get('/api/ringdowns')
        .query({ hospital: 'Fixture Hospital' })
        .set('Accept', 'application/json')
        .expect(HttpStatus.OK);
      // TODO expect that the ringdowns returned are all for "Fixture Hospital"
    });
  });

  describe('POST /ringdowns', () => {
    it('creates a new ringdown', async () => {
      await testSession
        .post('/api/ringdowns')
        .set('Accept', 'application/json')
        .send({
          ringdown: {}, // TODO after specify schema
        })
        .expect(HttpStatus.CREATED);
    });
  });

  describe('PATCH /ringdowns/{id}', () => {
    it('updates an existing ringdown', async () => {
      await testSession
        .patch('/api/ringdowns')
        .set('Accept', 'application/json')
        .send({
          ringdown: {}, // TODO after specify schema
        })
        .expect(HttpStatus.OK);
    });
  });
});
