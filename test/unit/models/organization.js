const assert = require('assert');
const helper = require('../../helper');
const models = require('../../../models');

describe('models.Organization', () => {
  beforeEach(async () => {
    await helper.loadFixtures(['organizations', 'users']);
  });

  it('creates a new Organization record', async () => {
    const org = await models.Organization.create({
      name: 'Kaiser Permanente',
      type: 'HEALTHCARE',
      CreatedById: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      UpdatedById: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    });
    assert(org);
    assert(org.id);
    assert.deepStrictEqual(org.name, 'Kaiser Permanente');
    assert.deepStrictEqual(org.type, 'HEALTHCARE');
    assert(org.createdAt);
    assert(org.updatedAt);

    const createdBy = await org.getCreatedBy();
    assert(createdBy);
    assert.deepStrictEqual(createdBy.name, 'Super User');

    const updatedBy = await org.getUpdatedBy();
    assert(updatedBy);
    assert.deepStrictEqual(updatedBy.name, 'Super User');
  });
});
