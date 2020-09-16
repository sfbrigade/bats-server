const assert = require('assert');
const helper = require('../../helper');
const models = require('../../../models');

describe('models.PatientDelivery', () => {
  beforeEach(async () => {
    await helper.loadFixtures([
      'emergencyMedicalServiceCalls',
      'emergencyMedicalServiceProviders',
      'hospitals',
    ]);
  });

  it('creates a new PatientDelivery record', async () => {
    const patient = await models.Patient.create({
      EmergencyMedicalServiceCallId: '6d6b74d6-f6f3-11ea-adc1-0242ac120002',
      patientNumber: 1,
      recordUpdateSource: 'fixture',
      recordCreateSource: 'fixture',
    });
    const ambulance = await models.Ambulance.create({
      EmergencyMedicalServiceProviderId: 'aac13870-f6f3-11ea-adc1-0242ac120002',
      ambulanceIdentifier: 'testId',
      recordUpdateSource: 'fixture',
      recordCreateSource: 'fixture',
    });
    const patientDelivery = await models.PatientDelivery.create({
      AmbulanceId: ambulance.id,
      PatientId: patient.id,
      HospitalId: '7f666fe4-dbdd-4c7f-ab44-d9157379a680',
      deliveryStatus: 'test',
      departureDateTime: '2004-10-19 10:23:54+02',
      estimatedArrivalTime: '2004-10-19 11:23:54+02',
      arrivalDateTime: '2004-10-19 12:23:54+02',
      admissionDateTime: '2004-10-19 13:23:54+02',
      recordUpdateSource: 'fixture',
      recordCreateSource: 'fixture',
    });
    assert(patientDelivery);
    assert(patientDelivery.id);
    assert.deepStrictEqual(patientDelivery.AmbulanceId, ambulance.id);
    assert.deepStrictEqual(patientDelivery.PatientId, patient.id);
    assert.deepStrictEqual(
      patientDelivery.HospitalId,
      '7f666fe4-dbdd-4c7f-ab44-d9157379a680'
    );
    assert.deepStrictEqual(patientDelivery.deliveryStatus, 'test');
    assert.deepStrictEqual(patientDelivery.recordCreateSource, 'fixture');
    assert.deepStrictEqual(patientDelivery.recordUpdateSource, 'fixture');
    assert(patientDelivery.departureDateTime);
    assert(patientDelivery.estimatedArrivalTime);
    assert(patientDelivery.arrivalDateTime);
    assert(patientDelivery.admissionDateTime);
    assert(patientDelivery.recordCreateTimestamp);
    assert(patientDelivery.recordUpdateTimestamp);
  });
});
