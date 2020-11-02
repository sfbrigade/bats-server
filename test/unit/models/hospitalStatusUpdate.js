const assert = require('assert');
const helper = require('../../helper');
const models = require('../../../models');

describe('models.HospitalStatusUpdate', () => {
  beforeEach(async () => {
    await helper.loadFixtures(['organizations', 'users', 'hospitals', 'hospitalUsers']);
  });

  it('creates a new HospitalStatusUpdate record', async () => {
    const hospitalStatusUpdate = await models.HospitalStatusUpdate.create({
      HospitalId: '7f666fe4-dbdd-4c7f-ab44-d9157379a680',
      EdAdminUserId: 'a950fed4-d996-4a41-a275-1cc4852d7664',
      updateDateTimeLocal: '2004-10-19 10:23:54+02',
      openEdBedCount: 1,
      openPsychBedCount: 3,
      divertStatusIndicator: false,
      CreatedById: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      UpdatedById: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    });
    assert(hospitalStatusUpdate);
    assert(hospitalStatusUpdate.id);
    assert(hospitalStatusUpdate.updateDateTimeLocal);
    assert.deepStrictEqual(hospitalStatusUpdate.openEdBedCount, 1);
    assert.deepStrictEqual(hospitalStatusUpdate.openPsychBedCount, 3);
    assert.deepStrictEqual(hospitalStatusUpdate.divertStatusIndicator, false);
    assert(hospitalStatusUpdate.createdAt);
    assert(hospitalStatusUpdate.updatedAt);

    const createdBy = await hospitalStatusUpdate.getCreatedBy();
    assert(createdBy);
    assert.deepStrictEqual(createdBy.name, 'Super User');

    const updatedBy = await hospitalStatusUpdate.getUpdatedBy();
    assert(updatedBy);
    assert.deepStrictEqual(updatedBy.name, 'Super User');

    const hospital = await hospitalStatusUpdate.getHospital();
    assert.deepStrictEqual(hospital.name, 'CPMC Davies Campus');

    const hospitalAdmin = await hospitalStatusUpdate.getEdAdminUser();
    assert.deepStrictEqual(hospitalAdmin.name, 'Sutter Admin');
  });
});
