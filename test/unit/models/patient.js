const assert = require('assert');
// TODO - remove the eslint disable once finished with the test
// eslint-disable-next-line no-unused-vars
const helper = require('../../helper');
const models = require('../../../models');

describe('models.Patient', () => {
  beforeEach(async () => {
    await helper.loadFixtures(['emergencyMedicalServiceCall']);
  });

  it('creates a new Patient record', async () => {
    const patient = await models.Patient.create({
      EmergencyMedicalServiceCallId: '6d6b74d6-f6f3-11ea-adc1-0242ac120002',
      patientNumber: 3,
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
      recordCreateTimestamp: '2004-10-19 10:23:54+02',
      recordCreateSource: 'test',
      recordUpdateTimestamp: '2004-10-19 10:23:54+02',
      recordUpdateSource: 'test',
    });
    assert(patient);
    assert(patient.id);
    assert(patient.EmergencyMedicalServiceCallId);
    assert.deepStrictEqual(patient.patientNumber, 3);
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
    assert(patient.recordCreateTimestamp);
    assert(patient.recordCreateSource);
    assert(patient.recordUpdateTimestamp);

    const call = await patient.getEmergencyMedicalServiceCall();
    assert(call);    
  });
});
