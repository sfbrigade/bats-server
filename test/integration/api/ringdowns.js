const HttpStatus = require('http-status-codes');
const session = require('supertest-session');

const helper = require('../../helper');
const app = require('../../../app');

describe('/api/ringdowns', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadFixtures([
      'organizations',
      'users',
      'ambulances',
      'emergencyMedicalServiceCalls',
      'hospitals',
      'patients',
    ]);

    // Login as paramedic user
    testSession = session(app);
    await testSession
      .post('/auth/local/login')
      .set('Accept', 'application/json')
      .send({ username: 'sffd.paramedic@example.com', password: 'abcd1234' })
      .expect(HttpStatus.OK);
  });

  describe.skip('GET /ringdowns', () => {
    // TODO
    it('returns a list of all active ringdowns', async () => {
      await testSession.get('/api/ringdowns').set('Accept', 'application/json').expect(HttpStatus.OK);
    });

    it('returns a returns a list of active ringdowns filtered by hospital', async () => {
      await testSession
        .get('/api/ringdowns')
        .query({ hospital: 'Fixture Hospital' })
        .set('Accept', 'application/json')
        .expect(HttpStatus.OK);
    });
  });

  describe('POST /ringdowns', () => {
    it('creates a new ringdown', async () => {
      await testSession
        .post('/api/ringdowns')
        .set('Accept', 'application/json')
        .send({
          ambulanceIdentifer: 'testId',
          dispatchCallNumber: 1234,
          hospitalId: '00752f60-068f-11eb-adc1-0242ac120002',
          estimatedArrivalTime: '2004-10-19 10:23:54+02',
          patient: {
            age: 30,
            sex: 'male',
            chiefComplaintDescription: 'Fainted while walking home.',
            systolicBloodPressure: 80,
            diastolicBloodPressure: 120,
            heartRateBpm: 70,
            oxygenSaturation: 98,
            temperature: 99.4,
            stableIndicator: true,
            combativeBehaviorIndicator: false,
            ivIndicator: false,
            additionalNotes: 'Needs assistance walking',
          },
        })
        .expect(HttpStatus.CREATED);
    });
  });

  describe.skip('PATCH /ringdowns/{id}', () => {
    // TODO
    it('updates an existing ringdown', async () => {
      await testSession
        .patch('/api/ringdowns')
        .set('Accept', 'application/json')
        .send({
        })
        .expect(HttpStatus.OK);
    });
  });
});
