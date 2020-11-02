const assert = require('assert');
const helper = require('../../helper');
const models = require('../../../models');

describe('models.Patient', () => {
  beforeEach(async () => {
    await helper.loadFixtures(['organizations', 'users', 'emergencyMedicalServiceCalls']);
  });

  it('creates a new Patient record', async () => {
    const patient = await models.Patient.create({
      EmergencyMedicalServiceCallId: '6d6b74d6-f6f3-11ea-adc1-0242ac120002',
      emergencyServiceResponseType: 'CODE 2',
      age: 4,
      sex: 'non-binary',
      stableIndicator: false,
      chiefComplaintDescription: 'test',
      heartRateBpm: 180,
      temperature: 98.6,
      systolicBloodPressure: 3,
      diastolicBloodPressure: 4,
      respiratoryRate: 120,
      oxygenSaturation: 90,
      ivIndicator: true,
      combativeBehaviorIndicator: false,
      otherObservationNotes: 'text',
      CreatedById: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      UpdatedById: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    });
    assert(patient);
    assert(patient.id);
    assert(patient.EmergencyMedicalServiceCallId);
    assert.deepStrictEqual(patient.age, 4);
    assert.deepStrictEqual(patient.sex, 'non-binary');
    assert.deepStrictEqual(patient.stableIndicator, false);
    assert.deepStrictEqual(patient.chiefComplaintDescription, 'test');
    assert.deepStrictEqual(patient.heartRateBpm, 180);
    assert.deepStrictEqual(patient.temperature, 98.6);
    assert.deepStrictEqual(patient.systolicBloodPressure, 3);
    assert.deepStrictEqual(patient.diastolicBloodPressure, 4);
    assert.deepStrictEqual(patient.respiratoryRate, 120);
    assert.deepStrictEqual(patient.oxygenSaturation, 90);
    assert.deepStrictEqual(patient.ivIndicator, true);
    assert.deepStrictEqual(patient.combativeBehaviorIndicator, false);
    assert.deepStrictEqual(patient.otherObservationNotes, 'text');
    assert(patient.createdAt);
    assert(patient.updatedAt);

    const createdBy = await patient.getCreatedBy();
    assert(createdBy);
    assert.deepStrictEqual(createdBy.name, 'Super User');

    const updatedBy = await patient.getUpdatedBy();
    assert(updatedBy);
    assert.deepStrictEqual(updatedBy.name, 'Super User');

    const call = await patient.getEmergencyMedicalServiceCall();
    assert(call);
    assert.deepStrictEqual(call.dispatchCallNumber, 911);
  });
});
