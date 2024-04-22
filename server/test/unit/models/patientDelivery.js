const assert = require('assert');
const helper = require('../../helper');
const models = require('../../../models');
const { DeliveryStatus } = require('shared/constants');

describe('models.PatientDelivery', () => {
  beforeEach(async () => {
    await helper.loadFixtures(['organizations', 'users', 'emergencyMedicalServiceCalls', 'ambulances', 'patients', 'hospitals']);
  });

  describe('.createRingdown()', () => {
    it('creates a new PatientDelivery record', async () => {
      const patientDelivery = await models.PatientDelivery.createRingdown(
        '7f666fe4-dbdd-4c7f-ab44-d9157379a680', // ambulanceId
        '136cf75e-55e8-4c31-a6bb-a90434ca9f28', // patientId
        '7f666fe4-dbdd-4c7f-ab44-d9157379a680', // hospitalId
        '6737fc42-f815-460f-888a-10435af12f08', // paramedicId
        '2004-10-19 10:23:54+02',
        12
      );
      assert(patientDelivery);
      assert(patientDelivery.id);
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatus, DeliveryStatus.RINGDOWN_SENT);
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatusDateTimeLocal, new Date('2004-10-19 10:23:54+02'));
      assert(patientDelivery.createdAt);
      assert(patientDelivery.updatedAt);

      const createdBy = await patientDelivery.getCreatedBy();
      assert(createdBy);
      assert.deepStrictEqual(createdBy.name, 'SFFD Paramedic');

      const updatedBy = await patientDelivery.getUpdatedBy();
      assert(updatedBy);
      assert.deepStrictEqual(updatedBy.name, 'SFFD Paramedic');

      const paramedicUser = await patientDelivery.getParamedicUser();
      assert(paramedicUser);
      assert.deepStrictEqual(paramedicUser.name, 'SFFD Paramedic');

      const ambulance = await patientDelivery.getAmbulance();
      assert.deepStrictEqual(ambulance.ambulanceIdentifier, 'SFFD-1');

      const patient = await patientDelivery.getPatient();
      assert(patient);

      const hospital = await patientDelivery.getHospital();
      assert.deepStrictEqual(hospital.name, 'CPMC Davies Campus');

      const patientDeliveryUpdates = await patientDelivery.getPatientDeliveryUpdates();
      assert.deepStrictEqual(patientDeliveryUpdates.length, 1);

      const patientDeliveryUpdate = patientDeliveryUpdates[0];
      assert.deepStrictEqual(patientDeliveryUpdate.deliveryStatus, DeliveryStatus.RINGDOWN_SENT);
      assert.deepStrictEqual(patientDeliveryUpdate.deliveryStatusDateTimeLocal, new Date('2004-10-19 10:23:54+02'));
    });
  });

  describe('.createDeliveryStatus()', () => {
    beforeEach(async () => {
      await helper.loadFixtures(['patientDeliveries', 'patientDeliveryUpdates']);
    });

    it('allows valid state transitions', async () => {
      const patientDelivery = await models.PatientDelivery.findByPk('4889b0c8-ce48-474a-ac5b-c5aca708451c');
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatus, DeliveryStatus.RINGDOWN_SENT);

      let now = new Date();
      await patientDelivery.createDeliveryStatusUpdate('449b1f54-7583-417c-8c25-8da7dde65f6d', DeliveryStatus.RINGDOWN_RECEIVED, now);
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatus, DeliveryStatus.RINGDOWN_RECEIVED);
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatusDateTimeLocal, now);

      now = new Date(now.getTime() + 10000);
      await patientDelivery.createDeliveryStatusUpdate('0a1f4d2e-689d-4b54-bb3c-7feba4444bb8', DeliveryStatus.ARRIVED, now);
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatus, DeliveryStatus.ARRIVED);
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatusDateTimeLocal, now);

      now = new Date(now.getTime() + 10000);
      await patientDelivery.createDeliveryStatusUpdate('0a1f4d2e-689d-4b54-bb3c-7feba4444bb8', DeliveryStatus.OFFLOADED, now);
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatus, DeliveryStatus.OFFLOADED);
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatusDateTimeLocal, now);

      now = new Date(now.getTime() + 10000);
      await patientDelivery.createDeliveryStatusUpdate('0a1f4d2e-689d-4b54-bb3c-7feba4444bb8', DeliveryStatus.RETURNED_TO_SERVICE, now);
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatus, DeliveryStatus.RETURNED_TO_SERVICE);
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatusDateTimeLocal, now);
    });

    it('can be redirected before being received', async () => {
      const patientDelivery = await models.PatientDelivery.findByPk('4889b0c8-ce48-474a-ac5b-c5aca708451c');
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatus, DeliveryStatus.RINGDOWN_SENT);

      const now = new Date();
      await patientDelivery.createDeliveryStatusUpdate('0a1f4d2e-689d-4b54-bb3c-7feba4444bb8', DeliveryStatus.REDIRECTED, now);
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatus, DeliveryStatus.REDIRECTED);
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatusDateTimeLocal, now);
    });

    it('can be redirected before being confirmed', async () => {
      const patientDelivery = await models.PatientDelivery.findByPk('4889b0c8-ce48-474a-ac5b-c5aca708451c');
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatus, DeliveryStatus.RINGDOWN_SENT);

      let now = new Date();
      await patientDelivery.createDeliveryStatusUpdate('449b1f54-7583-417c-8c25-8da7dde65f6d', DeliveryStatus.RINGDOWN_RECEIVED, now);
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatus, DeliveryStatus.RINGDOWN_RECEIVED);
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatusDateTimeLocal, now);

      now = new Date(now.getTime() + 10000);
      await patientDelivery.createDeliveryStatusUpdate('0a1f4d2e-689d-4b54-bb3c-7feba4444bb8', DeliveryStatus.REDIRECTED, now);
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatus, DeliveryStatus.REDIRECTED);
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatusDateTimeLocal, now);
    });

    it('can be redirected before arrival', async () => {
      const patientDelivery = await models.PatientDelivery.findByPk('4889b0c8-ce48-474a-ac5b-c5aca708451c');
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatus, DeliveryStatus.RINGDOWN_SENT);

      let now = new Date();
      await patientDelivery.createDeliveryStatusUpdate('449b1f54-7583-417c-8c25-8da7dde65f6d', DeliveryStatus.RINGDOWN_RECEIVED, now);
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatus, DeliveryStatus.RINGDOWN_RECEIVED);
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatusDateTimeLocal, now);

      now = new Date(now.getTime() + 10000);
      await patientDelivery.createDeliveryStatusUpdate('449b1f54-7583-417c-8c25-8da7dde65f6d', DeliveryStatus.RINGDOWN_CONFIRMED, now);
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatus, DeliveryStatus.RINGDOWN_CONFIRMED);
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatusDateTimeLocal, now);

      now = new Date(now.getTime() + 10000);
      await patientDelivery.createDeliveryStatusUpdate('0a1f4d2e-689d-4b54-bb3c-7feba4444bb8', DeliveryStatus.REDIRECTED, now);
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatus, DeliveryStatus.REDIRECTED);
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatusDateTimeLocal, now);
    });

    it('can be redirected before offloading', async () => {
      const patientDelivery = await models.PatientDelivery.findByPk('4889b0c8-ce48-474a-ac5b-c5aca708451c');
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatus, DeliveryStatus.RINGDOWN_SENT);

      let now = new Date();
      await patientDelivery.createDeliveryStatusUpdate('449b1f54-7583-417c-8c25-8da7dde65f6d', DeliveryStatus.RINGDOWN_RECEIVED, now);
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatus, DeliveryStatus.RINGDOWN_RECEIVED);
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatusDateTimeLocal, now);

      now = new Date(now.getTime() + 10000);
      await patientDelivery.createDeliveryStatusUpdate('449b1f54-7583-417c-8c25-8da7dde65f6d', DeliveryStatus.RINGDOWN_CONFIRMED, now);
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatus, DeliveryStatus.RINGDOWN_CONFIRMED);
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatusDateTimeLocal, now);

      now = new Date(now.getTime() + 10000);
      await patientDelivery.createDeliveryStatusUpdate('0a1f4d2e-689d-4b54-bb3c-7feba4444bb8', DeliveryStatus.ARRIVED, now);
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatus, DeliveryStatus.ARRIVED);
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatusDateTimeLocal, now);

      now = new Date(now.getTime() + 10000);
      await patientDelivery.createDeliveryStatusUpdate('0a1f4d2e-689d-4b54-bb3c-7feba4444bb8', DeliveryStatus.REDIRECTED, now);
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatus, DeliveryStatus.REDIRECTED);
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatusDateTimeLocal, now);
    });

    it('can skip received state directly to arrived', async () => {
      const patientDelivery = await models.PatientDelivery.findByPk('4889b0c8-ce48-474a-ac5b-c5aca708451c');
      const now = new Date();
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatus, DeliveryStatus.RINGDOWN_SENT);

      await patientDelivery.createDeliveryStatusUpdate('0a1f4d2e-689d-4b54-bb3c-7feba4444bb8', DeliveryStatus.ARRIVED, now);
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatus, DeliveryStatus.ARRIVED);
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatusDateTimeLocal, now);
    });

    it('throws an error for other invalid state transitions', async () => {
      const patientDelivery = await models.PatientDelivery.findByPk('4889b0c8-ce48-474a-ac5b-c5aca708451c');
      const now = new Date();
      assert.deepStrictEqual(patientDelivery.currentDeliveryStatus, DeliveryStatus.RINGDOWN_SENT);

      assert.rejects(patientDelivery.createDeliveryStatusUpdate('0a1f4d2e-689d-4b54-bb3c-7feba4444bb8', DeliveryStatus.OFFLOADED, now));
    });
  });

  describe('.toRingdownJSON()', () => {
    beforeEach(async () => {
      await helper.loadFixtures(['patientDeliveries', 'patientDeliveryUpdates']);
    });

    it('serializes the PatientDelivery and its dependent objects into a Ringdown', async () => {
      const patientDelivery = await models.PatientDelivery.findByPk('8b95ea8a-0171-483a-be74-ec17bbc12247');
      const json = await patientDelivery.toRingdownJSON();
      assert.deepStrictEqual(json, {
        id: '8b95ea8a-0171-483a-be74-ec17bbc12247',
        ambulance: {
          ambulanceIdentifier: 'SFFD-1',
          organization: {
            id: '1dd0dfd7-562e-48db-ae78-31b9136d3e15',
            name: 'San Francisco Fire Department',
          },
        },
        emsCall: { dispatchCallNumber: '911' },
        hospital: {
          id: '7f666fe4-dbdd-4c7f-ab44-d9157379a680',
          name: 'CPMC Davies Campus',
        },
        patient: {
          triageTag: null,
          triagePriority: null,
          age: null,
          sex: null,
          emergencyServiceResponseType: 'CODE 2',
          chiefComplaintDescription: null,
          stableIndicator: null,
          systolicBloodPressure: null,
          diastolicBloodPressure: null,
          heartRateBpm: null,
          respiratoryRate: null,
          oxygenSaturation: null,
          lowOxygenResponseType: null,
          supplementalOxygenAmount: null,
          temperature: null,
          treatmentNotes: null,
          etohSuspectedIndicator: false,
          drugsSuspectedIndicator: false,
          psychIndicator: false,
          combativeBehaviorIndicator: false,
          restraintIndicator: false,
          covid19SuspectedIndicator: false,
          ivIndicator: false,
          glasgowComaScale: null,
          otherObservationNotes: null,
        },
        patientDelivery: {
          currentDeliveryStatus: 'RETURNED TO SERVICE',
          currentDeliveryStatusDateTimeLocal: new Date('2004-10-19T08:27:54.000Z'),
          etaMinutes: 10,
          timestamps: {
            'RINGDOWN SENT': new Date('2004-10-19T08:23:54.000Z'),
            'RINGDOWN RECEIVED': new Date('2004-10-19T08:24:54.000Z'),
            ARRIVED: new Date('2004-10-19T08:25:54.000Z'),
            OFFLOADED: new Date('2004-10-19T08:26:54.000Z'),
            'RETURNED TO SERVICE': new Date('2004-10-19T08:27:54.000Z'),
          },
        },
      });
    });
  });
});
