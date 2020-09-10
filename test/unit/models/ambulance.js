import { describe } from 'mocha';

const assert = require('assert');
const helper = require('../../helper');
const models = require('../../../models');

describe('models.Ambulance', () => {
  beforeEach(async () => {
    await helper.loadFixtures(['ambulance']);
  });

  it('creates a new Ambulance record', async (Ambulance) => {
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

    assert(Ambulance);
    assert(Ambulance.id);
    assert(Ambulance.EmergencyMedicalServiceProvider_uuid);
    assert.deepStrictEqual(Ambulance.AmbulanceIdentifier, 'test');
    assert.deepStrictEqual(
      Ambulance.RecordCreateTimestamp,
      '2004-10-19 10:23:54+02'
    );
    assert.deepStrictEqual(Ambulance.RecordCreateSource, 'test');
    assert.deepStrictEqual(
      Ambulance.RecordUpdateTimestamp,
      '2004-10-19 10:23:54+02'
    );
    assert.deepStrictEqual(Ambulance.RecordUpdateSource, 'test');
  });
});
