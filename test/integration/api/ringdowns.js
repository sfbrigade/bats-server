const assert = require('assert');
const HttpStatus = require('http-status-codes');
const session = require('supertest-session');

const helper = require('../../helper');
const app = require('../../../app');
const models = require('../../../models');
const { DeliveryStatus } = require('../../../constants');

describe('/api/ringdowns', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadFixtures([
      'organizations',
      'users',
      'ambulances',
      'emergencyMedicalServiceCalls',
      'hospitals',
      'hospitalUsers',
      'patients',
      'patientDeliveries',
      'patientDeliveryUpdates',
    ]);

    testSession = session(app);
  });

  describe('GET /', () => {
    it('returns a list of all active ringdowns', async () => {
      await testSession
        .post('/auth/local/login')
        .set('Accept', 'application/json')
        .send({ username: 'super.user@example.com', password: 'abcd1234' })
        .expect(HttpStatus.OK);

      const response = await testSession.get('/api/ringdowns').set('Accept', 'application/json').expect(HttpStatus.OK);
      assert.deepStrictEqual(response.body.length, 4);
      const ids = response.body.map((ringdown) => ringdown.id).sort();
      assert.deepStrictEqual(ids[0], '4889b0c8-ce48-474a-ac5b-c5aca708451c');
      assert.deepStrictEqual(ids[1], 'd4fd2478-ecd6-4571-9fb3-842bfc64b511');
    });

    it('returns a list of active ringdowns filtered by hospital', async () => {
      await testSession
        .post('/auth/local/login')
        .set('Accept', 'application/json')
        .send({ username: 'sutter.operational@example.com', password: 'abcd1234' })
        .expect(HttpStatus.OK);

      const response = await testSession
        .get('/api/ringdowns')
        .query({ hospitalId: '7f666fe4-dbdd-4c7f-ab44-d9157379a680' })
        .set('Accept', 'application/json')
        .expect(HttpStatus.OK);
      assert.deepStrictEqual(response.body.length, 2);
      assert.deepStrictEqual(response.body[0].id, 'd4fd2478-ecd6-4571-9fb3-842bfc64b511');
    });

    it('returns a list of active ringdowns created by the calling EMS user', async () => {
      await testSession
        .post('/auth/local/login')
        .set('Accept', 'application/json')
        .send({ username: 'amr.paramedic@example.com', password: 'abcd1234' })
        .expect(HttpStatus.OK);

      const response = await testSession.get('/api/ringdowns/mine').set('Accept', 'application/json').expect(HttpStatus.OK);
      assert.deepStrictEqual(response.body.length, 1);
      assert.deepStrictEqual(response.body[0].id, '4889b0c8-ce48-474a-ac5b-c5aca708451c');
    });
  });

  describe('POST /', () => {
    const patientData = {
      age: 30,
      sex: 'MALE',
      emergencyServiceResponseType: 'CODE 2',
      chiefComplaintDescription: 'Fainted while walking home.',
      stableIndicator: true,
      systolicBloodPressure: 120,
      diastolicBloodPressure: 80,
      heartRateBpm: 70,
      respiratoryRate: 24,
      oxygenSaturation: 98,
      lowOxygenResponseType: 'SUPPLEMENTAL OXYGEN',
      supplementalOxygenAmount: 2,
      temperature: 99.4,
      etohSuspectedIndicator: false,
      drugsSuspectedIndicator: true,
      psychIndicator: false,
      combativeBehaviorIndicator: false,
      restraintIndicator: false,
      covid19SuspectedIndicator: true,
      ivIndicator: false,
      otherObservationNotes: 'Needs assistance walking',
    };

    it('creates a ringdown', async () => {
      await testSession
        .post('/auth/local/login')
        .set('Accept', 'application/json')
        .send({ username: 'norcal.paramedic@example.com', password: 'abcd1234' })
        .expect(HttpStatus.OK);

      const response = await testSession
        .post('/api/ringdowns')
        .set('Accept', 'application/json')
        .send({
          ambulance: {
            ambulanceIdentifier: 'NORCAL-1',
          },
          emsCall: {
            dispatchCallNumber: 1234,
          },
          hospital: {
            id: '00752f60-068f-11eb-adc1-0242ac120002',
          },
          patient: patientData,
          patientDelivery: {
            etaMinutes: 15,
          },
        })
        .expect(HttpStatus.CREATED);
      assert(response.body.id);
      assert.deepStrictEqual(response.body.ambulance.ambulanceIdentifier, 'NORCAL-1');
      assert.deepStrictEqual(response.body.emsCall.dispatchCallNumber, 1234);
      assert.deepStrictEqual(response.body.hospital.id, '00752f60-068f-11eb-adc1-0242ac120002');
      assert.deepStrictEqual(response.body.patient, patientData);
      assert.deepStrictEqual(response.body.patientDelivery.currentDeliveryStatus, 'RINGDOWN SENT');
      assert.deepStrictEqual(response.body.patientDelivery.etaMinutes, 15);
    });

    it('creates a new ambulance record as needed', async () => {
      await testSession
        .post('/auth/local/login')
        .set('Accept', 'application/json')
        .send({ username: 'norcal.paramedic@example.com', password: 'abcd1234' })
        .expect(HttpStatus.OK);

      const response = await testSession
        .post('/api/ringdowns')
        .set('Accept', 'application/json')
        .send({
          ambulance: {
            ambulanceIdentifier: 'NEW-1',
          },
          emsCall: {
            dispatchCallNumber: 1234,
          },
          hospital: {
            id: '00752f60-068f-11eb-adc1-0242ac120002',
          },
          patient: patientData,
          patientDelivery: {
            etaMinutes: 15,
          },
        })
        .expect(HttpStatus.CREATED);
      assert(response.body.id);
      assert.deepStrictEqual(response.body.ambulance.ambulanceIdentifier, 'NEW-1');

      const user = await models.User.findOne({ where: { email: 'norcal.paramedic@example.com' } });
      const ambulance = await models.Ambulance.findOne({ where: { ambulanceIdentifier: 'NEW-1' } });
      assert(ambulance);
      assert.deepStrictEqual(ambulance.CreatedById, user.id);
      assert.deepStrictEqual(ambulance.UpdatedById, user.id);
    });
  });

  describe('PATCH /:id/deliveryStatus', async () => {
    it('transitions to a next valid state', async () => {
      await testSession
        .post('/auth/local/login')
        .set('Accept', 'application/json')
        .send({ username: 'sutter.operational@example.com', password: 'abcd1234' })
        .expect(HttpStatus.OK);

      let now = new Date();
      await testSession
        .patch('/api/ringdowns/d4fd2478-ecd6-4571-9fb3-842bfc64b511/deliveryStatus')
        .set('Accept', 'application/json')
        .send({
          deliveryStatus: DeliveryStatus.RINGDOWN_RECEIVED,
          dateTimeLocal: now,
        })
        .expect(HttpStatus.OK);
      const patientDelivery = await models.PatientDelivery.findByPk('d4fd2478-ecd6-4571-9fb3-842bfc64b511');
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatus, DeliveryStatus.RINGDOWN_RECEIVED);
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatusDateTimeLocal, now);

      now = new Date();
      await testSession
        .patch('/api/ringdowns/d4fd2478-ecd6-4571-9fb3-842bfc64b511/deliveryStatus')
        .set('Accept', 'application/json')
        .send({
          deliveryStatus: DeliveryStatus.RINGDOWN_CONFIRMED,
          dateTimeLocal: now,
        })
        .expect(HttpStatus.OK);
      await patientDelivery.reload();
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatus, DeliveryStatus.RINGDOWN_CONFIRMED);
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatusDateTimeLocal, now);

      await testSession
        .post('/auth/local/login')
        .set('Accept', 'application/json')
        .send({ username: 'king.paramedic@example.com', password: 'abcd1234' })
        .expect(HttpStatus.OK);

      now = new Date();
      await testSession
        .patch('/api/ringdowns/d4fd2478-ecd6-4571-9fb3-842bfc64b511/deliveryStatus')
        .set('Accept', 'application/json')
        .send({
          deliveryStatus: DeliveryStatus.ARRIVED,
          dateTimeLocal: now,
        })
        .expect(HttpStatus.OK);
      await patientDelivery.reload();
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatus, DeliveryStatus.ARRIVED);
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatusDateTimeLocal, now);

      now = new Date();
      await testSession
        .patch('/api/ringdowns/d4fd2478-ecd6-4571-9fb3-842bfc64b511/deliveryStatus')
        .set('Accept', 'application/json')
        .send({
          deliveryStatus: DeliveryStatus.OFFLOADED,
          dateTimeLocal: now,
        })
        .expect(HttpStatus.OK);
      await patientDelivery.reload();
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatus, DeliveryStatus.OFFLOADED);
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatusDateTimeLocal, now);

      await testSession
        .post('/auth/local/login')
        .set('Accept', 'application/json')
        .send({ username: 'sutter.operational@example.com', password: 'abcd1234' })
        .expect(HttpStatus.OK);

      now = new Date();
      await testSession
        .patch('/api/ringdowns/d4fd2478-ecd6-4571-9fb3-842bfc64b511/deliveryStatus')
        .set('Accept', 'application/json')
        .send({
          deliveryStatus: DeliveryStatus.OFFLOADED_ACKNOWLEDGED,
          dateTimeLocal: now,
        })
        .expect(HttpStatus.OK);
      await patientDelivery.reload();
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatus, DeliveryStatus.OFFLOADED_ACKNOWLEDGED);
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatusDateTimeLocal, now);

      await testSession
        .post('/auth/local/login')
        .set('Accept', 'application/json')
        .send({ username: 'king.paramedic@example.com', password: 'abcd1234' })
        .expect(HttpStatus.OK);

      now = new Date();
      await testSession
        .patch('/api/ringdowns/d4fd2478-ecd6-4571-9fb3-842bfc64b511/deliveryStatus')
        .set('Accept', 'application/json')
        .send({
          deliveryStatus: DeliveryStatus.RETURNED_TO_SERVICE,
          dateTimeLocal: now,
        })
        .expect(HttpStatus.OK);
      await patientDelivery.reload();
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatus, DeliveryStatus.RETURNED_TO_SERVICE);
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatusDateTimeLocal, now);
    });

    it('can transition to ARRIVED before RINGDOWN_RECEIVED/CONFIRMED', async () => {
      const patientDelivery = await models.PatientDelivery.findByPk('d4fd2478-ecd6-4571-9fb3-842bfc64b511');
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatus, DeliveryStatus.RINGDOWN_SENT);

      await testSession
        .post('/auth/local/login')
        .set('Accept', 'application/json')
        .send({ username: 'king.paramedic@example.com', password: 'abcd1234' })
        .expect(HttpStatus.OK);

      const now = new Date();
      await testSession
        .patch('/api/ringdowns/d4fd2478-ecd6-4571-9fb3-842bfc64b511/deliveryStatus')
        .set('Accept', 'application/json')
        .send({
          deliveryStatus: DeliveryStatus.ARRIVED,
          dateTimeLocal: now,
        })
        .expect(HttpStatus.OK);

      await patientDelivery.reload();
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatus, DeliveryStatus.ARRIVED);
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatusDateTimeLocal, now);
      let updates = await patientDelivery.getPatientDeliveryUpdates();
      assert.deepStrictEqual(
        updates.find((pdu) => pdu.deliveryStatus === DeliveryStatus.RINGDOWN_RECEIVED),
        undefined
      );

      await testSession
        .post('/auth/local/login')
        .set('Accept', 'application/json')
        .send({ username: 'sutter.operational@example.com', password: 'abcd1234' })
        .expect(HttpStatus.OK);

      const after = new Date();
      await testSession
        .patch('/api/ringdowns/d4fd2478-ecd6-4571-9fb3-842bfc64b511/deliveryStatus')
        .set('Accept', 'application/json')
        .send({
          deliveryStatus: DeliveryStatus.RINGDOWN_RECEIVED,
          dateTimeLocal: after,
        })
        .expect(HttpStatus.OK);

      await patientDelivery.reload();
      // current delivery status remains as ARRIVED
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatus, DeliveryStatus.ARRIVED);
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatusDateTimeLocal, now);
      // but we should now find the ringdown update in the status updates
      updates = await patientDelivery.getPatientDeliveryUpdates();
      assert(updates.find((pdu) => pdu.deliveryStatus === DeliveryStatus.RINGDOWN_RECEIVED));
    });
  });

  describe('PATCH /:id', () => {
    it('updates an existing ringdown', async () => {
      await testSession
        .post('/auth/local/login')
        .set('Accept', 'application/json')
        .send({ username: 'sffd.paramedic@example.com', password: 'abcd1234' })
        .expect(HttpStatus.OK);

      const response = await testSession
        .patch('/api/ringdowns/8b95ea8a-0171-483a-be74-ec17bbc12247')
        .set('Accept', 'application/json')
        .send({
          ambulance: {
            ambulanceIdentifier: 'SFFD-2',
          },
          emsCall: {
            dispatchCallNumber: 7777,
          },
          hospital: {
            id: '7f666fe4-dbdd-4c7f-ab44-d9157379a680',
          },
          patient: {
            age: 99,
            sex: 'FEMALE',
            otherObservationNotes: 'in stable condition',
          },
          patientDelivery: {
            etaMinutes: 15,
          },
        })
        .expect(HttpStatus.OK);

      assert.deepStrictEqual(response.body.ambulance.ambulanceIdentifier, 'SFFD-2');
      assert.deepStrictEqual(response.body.emsCall.dispatchCallNumber, 7777);
      assert.deepStrictEqual(response.body.hospital.id, '7f666fe4-dbdd-4c7f-ab44-d9157379a680');
      assert.deepStrictEqual(response.body.patient.age, 99);
      assert.deepStrictEqual(response.body.patient.sex, 'FEMALE');
      assert.deepStrictEqual(response.body.patient.otherObservationNotes, 'in stable condition');
      assert.deepStrictEqual(response.body.patientDelivery.etaMinutes, 15);

      const patientDelivery = await models.PatientDelivery.findByPk('8b95ea8a-0171-483a-be74-ec17bbc12247');
      const patient = await patientDelivery.getPatient();
      assert.deepStrictEqual(patient.age, 99);
      assert.deepStrictEqual(patient.sex, 'FEMALE');
      assert.deepStrictEqual(patient.otherObservationNotes, 'in stable condition');
    });
  });
});
