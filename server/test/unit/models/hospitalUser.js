const assert = require('assert');
const helper = require('../../helper');
const models = require('../../../models');

describe('models.HospitalUser', () => {
  beforeEach(async () => {
    await helper.loadFixtures(['organizations', 'users', 'hospitals']);
  });

  it('creates a new HospitalUser record', async () => {
    const hospitalUser = await models.HospitalUser.create({
      HospitalId: '7f666fe4-dbdd-4c7f-ab44-d9157379a680',
      EdAdminUserId: '449b1f54-7583-417c-8c25-8da7dde65f6d',
      CreatedById: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      UpdatedById: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    });
    assert(hospitalUser);
    assert(hospitalUser.id);
    assert(hospitalUser.createdAt);
    assert(hospitalUser.updatedAt);

    const createdBy = await hospitalUser.getCreatedBy();
    assert(createdBy);
    assert.deepStrictEqual(createdBy.name, 'Super User');

    const updatedBy = await hospitalUser.getUpdatedBy();
    assert(updatedBy);
    assert.deepStrictEqual(updatedBy.name, 'Super User');

    const hospital = await hospitalUser.getHospital();
    assert.deepStrictEqual(hospital.name, 'CPMC Davies');

    const user = await hospitalUser.getEdAdminUser();
    assert.deepStrictEqual(user.name, 'Sutter Operational');
  });
});
