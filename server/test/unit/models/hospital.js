const assert = require('assert');
const helper = require('../../helper');
const models = require('../../../models');

describe('models.Hospital', () => {
  beforeEach(async () => {
    await helper.loadFixtures(['organizations', 'users']);
  });

  it('creates a new Hospital record', async () => {
    const hospital = await models.Hospital.create({
      OrganizationId: '25ffdd7c-b4cf-4ebb-9750-1e628370e13b',
      name: 'CPMC California Campus',
      CreatedById: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      UpdatedById: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    });
    assert(hospital);
    assert(hospital.id);
    assert.deepStrictEqual(hospital.name, 'CPMC California Campus');
    assert(hospital.createdAt);
    assert(hospital.updatedAt);

    const createdBy = await hospital.getCreatedBy();
    assert(createdBy);
    assert.deepStrictEqual(createdBy.name, 'Super User');

    const updatedBy = await hospital.getUpdatedBy();
    assert(updatedBy);
    assert.deepStrictEqual(updatedBy.name, 'Super User');
  });

  describe('.getAmbulanceCounts()', () => {
    beforeEach(async () => {
      await helper.loadFixtures([
        'hospitals',
        'hospitalUsers',
        'hospitalStatusUpdates',
        'ambulances',
        'emergencyMedicalServiceCalls',
        'patients',
        'patientDeliveries',
        'patientDeliveryUpdates',
      ]);
    });

    it('returns enRoute/offloading counts for the associated hospital', async () => {
      const hospital = await models.Hospital.findByPk('7f666fe4-dbdd-4c7f-ab44-d9157379a680');
      const deliveries = await hospital.getAmbulanceCounts();
      assert.deepStrictEqual(deliveries, { enRoute: 3, offloading: 1 });
    });
  });
});
