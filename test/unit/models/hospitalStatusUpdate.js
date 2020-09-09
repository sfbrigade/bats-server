const assert = require('assert');
const helper = require('../../helper');
const models = require('../../../models');

describe('models.HospitalStatusUpdate', () => {
  beforeEach(async () => {
    await helper.loadFixtures(['hospital', 'hospitalAdministrator']);
  });

  it('creates a new HospitalStatusUpdate record', async () => {
    const hospitalStatusUpdate = await models.HospitalStatusUpdate.create({
      HospitalId: '7f666fe4-dbdd-4c7f-ab44-d9157379a680',
      HospitalAdministratorId: '136cf75e-55e8-4c31-a6bb-a90434ca9f18',
      updateDatetime: '2004-10-19 10:23:54+02',
      openedBedCount: 1,
      edWaitingRoomCount: 2,
      divertStatusIndicator: false,
      recordUpdateSource: 'test',
      recordCreateSource: 'test',
    });
    assert(hospitalStatusUpdate);
    assert(hospitalStatusUpdate.id);
    assert(hospitalStatusUpdate.updateDatetime);
    assert.deepStrictEqual(hospitalStatusUpdate.openedBedCount, 1);
    assert.deepStrictEqual(hospitalStatusUpdate.edWaitingRoomCount, 2);
    assert.deepStrictEqual(hospitalStatusUpdate.divertStatusIndicator, false);
    assert.deepStrictEqual(hospitalStatusUpdate.recordCreateSource, 'test');
    assert.deepStrictEqual(hospitalStatusUpdate.recordUpdateSource, 'test');
    assert(hospitalStatusUpdate.recordUpdateTimestamp);
    assert(hospitalStatusUpdate.recordCreateTimestamp);

    const hospital = await hospitalStatusUpdate.getHospital();
    assert.deepStrictEqual(hospital.hospitalName, 'Fixture Hospital');
    const hospitalAdmin = await hospitalStatusUpdate.getHospitalAdministrator();
    assert.deepStrictEqual(hospitalAdmin.firstName, 'Paul');
  });
});
