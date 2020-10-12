const assert = require('assert');
// TODO - remove the eslint disable once finished with the test
// eslint-disable-next-line no-unused-vars
const helper = require('../../helper');
const models = require('../../../models');

describe('models.EmergencyMedicalServiceProvider', () => {
  beforeEach(async () => {});

  it('creates a new EmergencyMedicalServiceProvider record', async () => {
    const emergencyMedicalServiceProvider = await models.EmergencyMedicalServiceProvider.create({
      emergencyMedicalServiceProviderName: 'test',
      recordCreateSource: 'test',
      recordUpdateSource: 'test',
    });
    assert(emergencyMedicalServiceProvider);
    assert(emergencyMedicalServiceProvider.id);
    assert.deepStrictEqual(emergencyMedicalServiceProvider.emergencyMedicalServiceProviderName, 'test');
    assert(emergencyMedicalServiceProvider.recordCreateTimestamp);
    assert.deepStrictEqual(emergencyMedicalServiceProvider.recordCreateSource, 'test');
    assert(emergencyMedicalServiceProvider.recordUpdateTimestamp);
    assert.deepStrictEqual(emergencyMedicalServiceProvider.recordUpdateSource, 'test');
  });
});
