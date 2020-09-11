const assert = require('assert');
// TODO - remove the eslint disable once finished with the test
// eslint-disable-next-line no-unused-vars
const helper = require('../../helper');
const models = require('../../../models');

describe.skip('models.Ambulance', () => {
  beforeEach(async () => {});

  it('creates a new Ambulance record', async () => {
    const [ambulance] = await Promise.all([
      models.Ambulance.create({
        AmbulanceId: '7f666fe4-dbdd-4c7f-ab44-d9157379a680',
        EmergencyMedicalServiceProvider_uuid:
          '7f766fe4-dbdd-4c7f-ab44-d9157379a680',
        AmbulanceIdentifier: 'test',
        RecordCreateTimestamp: '2004-10-19 10:23:54+02',
        RecordCreateSource: 'test',
        RecordUpdateTimestamp: '2004-10-19 10:23:54+02',
        RecordUpdateSource: 'test',
      }),
    ]);

    assert(ambulance);
    assert(ambulance.id);
    assert(ambulance.EmergencyMedicalServiceProvider_uuid);
    assert.deepStrictEqual(ambulance.AmbulanceIdentifier, 'test');
    assert.deepStrictEqual(
      ambulance.RecordCreateTimestamp,
      '2004-10-19 10:23:54+02'
    );
    assert.deepStrictEqual(ambulance.RecordCreateSource, 'test');
    assert.deepStrictEqual(
      ambulance.RecordUpdateTimestamp,
      '2004-10-19 10:23:54+02'
    );
    assert.deepStrictEqual(ambulance.RecordUpdateSource, 'test');
  });
});
