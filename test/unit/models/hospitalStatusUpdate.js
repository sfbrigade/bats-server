const assert = require('assert');
const helper = require('../../helper');
const models = require('../../../models');

describe('models.HospitalStatusUpdate', () => {
  beforeEach(async () => {
    await helper.loadFixtures(['organizations', 'users', 'hospitals', 'hospitalUsers', 'hospitalStatusUpdates']);
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

  describe("scope('latest')", () => {
    it('returns only the latest status update per hospital', async () => {
      const hospitalStatusUpdates = await models.HospitalStatusUpdate.scope('latest').findAll({
        include: [models.Hospital],
      });
      // should only return one update per the 2 hospitals
      assert.deepStrictEqual(hospitalStatusUpdates.length, 2);
      // each update should reflect the latest (test data year 2005 vs 2004)
      assert.deepStrictEqual(hospitalStatusUpdates[0].Hospital.name, 'Sutter Hospital');
      assert.deepStrictEqual(hospitalStatusUpdates[0].updateDateTimeLocal.getFullYear(), 2005);
      assert.deepStrictEqual(hospitalStatusUpdates[1].Hospital.name, 'CPMC Davies Campus');
      assert.deepStrictEqual(hospitalStatusUpdates[1].updateDateTimeLocal.getFullYear(), 2005);
    });
  });
});
