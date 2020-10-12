const assert = require('assert');
const helper = require('../../helper');
const models = require('../../../models');

describe('models.Ambulance', () => {
  beforeEach(async () => {
    await helper.loadFixtures(['organizations', 'users']);
  });

  it('creates a new Ambulance record in the SFFD', async () => {
    const ambulance = await models.Ambulance.create({
      OrganizationId: '1dd0dfd7-562e-48db-ae78-31b9136d3e15',
      ambulanceIdentifier: 'test',
      CreatedById: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      UpdatedById: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    });

    assert(ambulance);
    assert(ambulance.id);
    assert.deepStrictEqual(ambulance.OrganizationId, '1dd0dfd7-562e-48db-ae78-31b9136d3e15');
    assert.deepStrictEqual(ambulance.ambulanceIdentifier, 'test');
    assert.deepStrictEqual(ambulance.CreatedById, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');
    assert.deepStrictEqual(ambulance.UpdatedById, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');

    const org = await ambulance.getOrganization();
    assert(org);
    assert.deepStrictEqual(org.name, 'City and County of San Francisco Fire Department');
  });
});
