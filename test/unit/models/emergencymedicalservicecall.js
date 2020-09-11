const assert = require('assert');
// TODO - remove the eslint disable once finished with the test
// eslint-disable-next-line no-unused-vars
const helper = require('../../helper');
const models = require('../../../models');

describe.skip('models.EmergencyMedicalServiceCall', () => {
  beforeEach(async () => {});

  it('creates a new EmergencyMedicalServiceCall record', async () => {
    const [emergencyMedicalServiceCall] = await Promise.all([
      models.EmergencyMedicalServiceCall.create({
        Id: '7f666fe4-dbdd-4c7f-ab44-d9157379a680',
        DispatchCallNumber: 1,
        StartDateTime: '2004-10-19 10:23:54+02',
        RecordCreateTimestamp: '2004-10-19 10:23:54+02',
        RecordCreateSource: 'test',
        RecordUpdateTimestamp: '2004-10-19 10:23:54+02',
        RecordUpdateSource: 'test',
      }),
    ]);
    assert(emergencyMedicalServiceCall);
    assert(emergencyMedicalServiceCall.id);
    assert.deepStrictEqual(emergencyMedicalServiceCall.DispatchCallNumber, 1);
    assert.deepStrictEqual(
      emergencyMedicalServiceCall.RecordCreateTimestamp,
      '2004-10-19 10:23:54+02'
    );
    assert.deepStrictEqual(
      emergencyMedicalServiceCall.RecordCreateSource,
      'test'
    );
    assert.deepStrictEqual(
      emergencyMedicalServiceCall.RecordUpdateTimestamp,
      '2004-10-19 10:23:54+02'
    );
    assert.deepStrictEqual(
      emergencyMedicalServiceCall.RecordUpdateSource,
      'test'
    );
  });
});
