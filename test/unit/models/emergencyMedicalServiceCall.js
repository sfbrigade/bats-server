const assert = require('assert');
// TODO - remove the eslint disable once finished with the test
// eslint-disable-next-line no-unused-vars
const helper = require('../../helper');
const models = require('../../../models');

describe('models.EmergencyMedicalServiceCall', () => {
  beforeEach(async () => {});

  it('creates a new EmergencyMedicalServiceCall record', async () => {
    const emergencyMedicalServiceCall = await models.EmergencyMedicalServiceCall.create({
      dispatchCallNumber: 1,
      startDateTime: '2004-10-19 10:23:54+02',
      recordCreateSource: 'test',
      recordUpdateSource: 'test',
    });
    assert(emergencyMedicalServiceCall);
    assert(emergencyMedicalServiceCall.id);
    assert.deepStrictEqual(emergencyMedicalServiceCall.dispatchCallNumber, 1);
    assert(emergencyMedicalServiceCall.recordCreateTimestamp);
    assert.deepStrictEqual(emergencyMedicalServiceCall.recordCreateSource, 'test');
    assert(emergencyMedicalServiceCall.recordUpdateTimestamp);
    assert.deepStrictEqual(emergencyMedicalServiceCall.recordUpdateSource, 'test');
  });
});
