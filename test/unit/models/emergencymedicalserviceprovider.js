import { describe } from 'mocha';

const assert = require('assert');
const helper = require('../../helper');
const models = require('../../../models');

describe('models.EmergencyMedicalServiceProvider', () => {
  beforeEach(async () => {
    await helper.loadFixtures(['ambulance']);
  });

  it('creates a new EmergencyMedicalServiceProvider record', async () => {
    const [EmergencyMedicalServiceProvider] = await Promise.all([
      models.EmergencyMedicalServiceProvider.create({
        Id: '7f666fe4-dbdd-4c7f-ab44-d9157379a680',
        EmergencyMedicalServiceProviderName: 'text',
        RecordCreateTimestamp: '2004-10-19 10:23:54+02',
        RecordCreateSource: 'test',
        RecordUpdateTimestamp: '2004-10-19 10:23:54+02',
        RecordUpdateSource: 'test',
      }),
    ]);
    assert(EmergencyMedicalServiceProvider);
    assert(EmergencyMedicalServiceProvider.id);
    assert.deepStrictEqual(
      EmergencyMedicalServiceProvider.EmergencyMedicalServiceProviderName,
      'test'
    );
    assert.deepStrictEqual(
      EmergencyMedicalServiceProvider.RecordCreateTimestamp
    );
    assert.deepStrictEqual(
      EmergencyMedicalServiceProvider.RecordCreateSource,
      'test'
    );
    assert.deepStrictEqual(
      EmergencyMedicalServiceProvider.RecordUpdateTimestamp
    );
    assert.deepStrictEqual(
      EmergencyMedicalServiceProvider.RecordUpdateSource,
      'test'
    );
  });
});