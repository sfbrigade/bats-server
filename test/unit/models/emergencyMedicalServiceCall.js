const assert = require('assert');
const helper = require('../../helper');
const models = require('../../../server/models');

describe('models.EmergencyMedicalServiceCall', () => {
  beforeEach(async () => {
    await helper.loadFixtures(['organizations', 'users']);
  });

  it('creates a new EmergencyMedicalServiceCall record', async () => {
    const emsCall = await models.EmergencyMedicalServiceCall.create({
      dispatchCallNumber: 1,
      startDateTimeLocal: '2004-10-19 10:23:54+02',
      CreatedById: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      UpdatedById: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    });
    assert(emsCall);
    assert(emsCall.id);
    assert.deepStrictEqual(emsCall.dispatchCallNumber, 1);
    assert(emsCall.createdAt);
    assert(emsCall.updatedAt);

    const createdBy = await emsCall.getCreatedBy();
    assert(createdBy);
    assert.deepStrictEqual(createdBy.name, 'Super User');

    const updatedBy = await emsCall.getUpdatedBy();
    assert(updatedBy);
    assert.deepStrictEqual(updatedBy.name, 'Super User');
  });
});
