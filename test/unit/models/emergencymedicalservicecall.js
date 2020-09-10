import { describe } from 'mocha';

const assert = require('assert');
const helper = require('../../helper');
const models = require('../../../models');

describe('models.EmergencyMedicalServiceCall', () => {
  beforeEach(async () => {
    await helper.loadFixtures(['patient']);
  });

  it('creates a new EmergencyMedicalServiceCall record', async (EmergencyMedicalServiceCall) => {
    const [emergencymedicalservicecall] = await Promise.all([
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
    assert(EmergencyMedicalServiceCall);
    assert(EmergencyMedicalServiceCall.id);
    assert.deepStrictEqual(EmergencyMedicalServiceCall.DispatchCallNumber, 1);
    assert.deepStrictEqual(
      EmergencyMedicalServiceCall.RecordCreateTimestamp,
      '2004-10-19 10:23:54+02'
    );
    assert.deepStrictEqual(
      EmergencyMedicalServiceCall.RecordCreateSource,
      'test'
    );
    assert.deepStrictEqual(
      EmergencyMedicalServiceCall.RecordUpdateTimestamp,
      '2004-10-19 10:23:54+02'
    );
    assert.deepStrictEqual(
      EmergencyMedicalServiceCall.RecordUpdateSource,
      'test'
    );
  });
});
