const assert = require('assert');
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
      'patientDeliveries',
    ]);

    testSession = session(app);
    await testSession
      .post('/auth/local/login')
      .set('Accept', 'application/json')
      .send({ username: 'sffd.paramedic@example.com', password: 'abcd1234' })
      .expect(HttpStatus.OK);
  });

  describe('GET /', () => {
    it('returns a list of all active ringdowns', async () => {
      const response = await testSession.get('/api/ringdowns').set('Accept', 'application/json').expect(HttpStatus.OK);
      assert.deepStrictEqual(response.body.length, 2);
      const ids = response.body.map(ringdown => ringdown.id).sort();
      assert.deepStrictEqual(ids[0], '4889b0c8-ce48-474a-ac5b-c5aca708451c');
      assert.deepStrictEqual(ids[1], 'd4fd2478-ecd6-4571-9fb3-842bfc64b511');
    });

    it('returns a returns a list of active ringdowns filtered by hospital', async () => {
      const response = await testSession
        .get('/api/ringdowns?hospitalId=7f666fe4-dbdd-4c7f-ab44-d9157379a680')
        .query({ hospital: 'Fixture Hospital' })
        .set('Accept', 'application/json')
        .expect(HttpStatus.OK);
      assert.deepStrictEqual(response.body.length, 1);
      assert.deepStrictEqual(response.body[0].id, 'd4fd2478-ecd6-4571-9fb3-842bfc64b511')
    });
  });

  describe('POST /', () => {
    it('creates a ringdown', async () => {
      const response = await testSession
        .post('/api/ringdowns')
        .set('Accept', 'application/json')
        .send({
          ambulance: {
            ambulanceIdentifer: 'testId',
          },
          emsCall: {
            dispatchCallNumber: 1234,
          },
          hospital: {
            id: '00752f60-068f-11eb-adc1-0242ac120002',
          },
          patient: {
            age: 30,
            sex: 'male',
            patientNumber: 4,
            chiefComplaintDescription: 'Fainted while walking home.',
            systolicBloodPressure: 80,
            diastolicBloodPressure: 120,
            heartRateBpm: 70,
            oxygenSaturation: 98,
            temperature: 99.4,
            stableIndicator: true,
            combativeBehaviorIndicator: false,
            ivIndicator: false,
            otherObservationNotes: 'Needs assistance walking',
          },
          patientDelivery: {
            estimatedArrivalTime: '2004-10-19 10:23:54+02',
          },
        })
        .expect(HttpStatus.CREATED);
      assert(response.body.id);
      assert(response.body.ambulance);
      assert(response.body.emsCall);
      assert(response.body.hospital);
      assert(response.body.patient);
      assert(response.body.patientDelivery);
    });
  });

  describe('PATCH /:id', () => {
    it('updates an existing ringdown', async () => {
      const response = await testSession
        .patch('/api/ringdowns/8b95ea8a-0171-483a-be74-ec17bbc12247')
        .set('Accept', 'application/json')
        .send({
          ambulance: {
            ambulanceIdentifer: 'secondTestId',
          },
          emsCall: {
            dispatchCallNumber: 7777,
          },
          hospital: {
            id: '7f666fe4-dbdd-4c7f-ab44-d9157379a680',
          },
          patient: {
            age: 99,
            sex: 'female',
            otherObservationNotes: 'in stable condition',
          },
          patientDelivery: {
            arrivalDateTime: '2005-10-19 10:23:54',
          },
        })
        .expect(HttpStatus.OK);

      assert.deepStrictEqual(response.body.ambulance.ambulanceIdentifier, 'secondTestId');
      assert.deepStrictEqual(response.body.emsCall.dispatchCallNumber, 7777);
      assert.deepStrictEqual(response.body.hospital.id, '7f666fe4-dbdd-4c7f-ab44-d9157379a680');
      assert.deepStrictEqual(response.body.patient.age, 99);
      assert.deepStrictEqual(response.body.patient.sex, 'female');
      assert.deepStrictEqual(response.body.patient.otherObservationNotes, 'in stable condition');
      assert.deepStrictEqual(response.body.patientDelivery.arrivalDateTime, '2005-10-19T10:23:54.000Z');
    });
  });
});
