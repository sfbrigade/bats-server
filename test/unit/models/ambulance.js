const assert = require('assert');
const helper = require('../../helper');
const models = require('../../../models');

describe('models.Ambulance', () => {
  beforeEach(async () => {
    await helper.loadFixtures(['emergencyMedicalServiceProviders']);
  });

  it('creates a new Ambulance record', async () => {
    const ambulance = await models.Ambulance.create({
      EmergencyMedicalServiceProviderId: 'aac13870-f6f3-11ea-adc1-0242ac120002',
      ambulanceIdentifier: 'test',
      recordCreateSource: 'test',
      recordUpdateSource: 'test',
    });

    assert(ambulance);
    assert(ambulance.id);
    assert(ambulance.EmergencyMedicalServiceProviderId);
    assert.deepStrictEqual(ambulance.ambulanceIdentifier, 'test');
    assert.deepStrictEqual(ambulance.recordCreateSource, 'test');
    assert.deepStrictEqual(ambulance.recordUpdateSource, 'test');

    const provider = ambulance.getEmergencyMedicalServiceProvider();
    assert(provider);
  });
});
