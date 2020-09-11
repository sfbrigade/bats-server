const assert = require('assert');
const helper = require('../../helper');
const models = require('../../../models');

describe('models.HospitalAdministrator', () => {
  beforeEach(async () => {
    await helper.loadFixtures(['hospital']);
  });

  it('creates a new HospitalAdministrator record', async () => {
    const hospitalAdmin = await models.HospitalAdministrator.create({
      HospitalId: '7f666fe4-dbdd-4c7f-ab44-d9157379a680',
      hospitalAdministratorIdentifier: 'Some hospital specific id',
      firstName: 'John',
      lastName: 'Doe',
      recordUpdateSource: 'test',
      recordCreateSource: 'test',
    });
    assert(hospitalAdmin);
    assert(hospitalAdmin.id);
    assert.deepStrictEqual(hospitalAdmin.firstName, 'John');
    assert.deepStrictEqual(hospitalAdmin.lastName, 'Doe');
    assert.deepStrictEqual(hospitalAdmin.recordUpdateSource, 'test');
    assert.deepStrictEqual(hospitalAdmin.recordCreateSource, 'test');
    assert(hospitalAdmin.recordUpdateTimestamp);
    assert(hospitalAdmin.recordCreateTimestamp);

    const hospital = await hospitalAdmin.getHospital();
    assert.deepStrictEqual(hospital.hospitalName, 'Fixture Hospital');
  });
});
