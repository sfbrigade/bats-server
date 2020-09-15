const assert = require('assert');
const helper = require('../../helper');
const models = require('../../../models');

describe('models.PatientDelivery', () => {
  beforeEach(async () => {
    await helper.loadFixtures([
      'emergencyMedicalServiceCall',
      'emergencyMedicalServiceProvider',
      'hospital',
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
      recordUpdateSource: 'fixture',
      recordCreateSource: 'fixture',
    });
    assert(patientDelivery);
  });
});
