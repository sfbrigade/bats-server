const assert = require('assert');
const helper = require('../../helper');
const models = require('../../../models');

describe('models.PatientDelivery', () => {
  beforeEach(async () => {
    await helper.loadFixtures(['organizations', 'users', 'emergencyMedicalServiceCalls', 'ambulances', 'patients', 'hospitals']);
  });

  it('creates a new PatientDelivery record', async () => {
    const patientDelivery = await models.PatientDelivery.create({
      AmbulanceId: '7f666fe4-dbdd-4c7f-ab44-d9157379a680',
      PatientId: '136cf75e-55e8-4c31-a6bb-a90434ca9f28',
      HospitalId: '7f666fe4-dbdd-4c7f-ab44-d9157379a680',
      ParamedicUserId: '6737fc42-f815-460f-888a-10435af12f08',
      deliveryStatus: 'test',
      departureDateTime: '2004-10-19 10:23:54+02',
      estimatedArrivalTime: '2004-10-19 11:23:54+02',
      arrivalDateTime: '2004-10-19 12:23:54+02',
      admissionDateTime: '2004-10-19 13:23:54+02',
      CreatedById: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      UpdatedById: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    });
    assert(patientDelivery);
    assert(patientDelivery.id);
    assert.deepStrictEqual(patientDelivery.deliveryStatus, 'test');
    assert(patientDelivery.departureDateTime);
    assert(patientDelivery.estimatedArrivalTime);
    assert(patientDelivery.arrivalDateTime);
    assert(patientDelivery.admissionDateTime);
    assert(patientDelivery.createdAt);
    assert(patientDelivery.updatedAt);

    const createdBy = await patientDelivery.getCreatedBy();
    assert(createdBy);
    assert.deepStrictEqual(createdBy.name, 'Super User');

    const updatedBy = await patientDelivery.getUpdatedBy();
    assert(updatedBy);
    assert.deepStrictEqual(updatedBy.name, 'Super User');

    const ambulance = await patientDelivery.getAmbulance();
    assert.deepStrictEqual(ambulance.ambulanceIdentifier, 'testId');

    const patient = await patientDelivery.getPatient();
    assert.deepStrictEqual(patient.patientNumber, 1);

    const hospital = await patientDelivery.getHospital();
    assert.deepStrictEqual(hospital.name, 'CPMC Davies Campus');
  });
});
