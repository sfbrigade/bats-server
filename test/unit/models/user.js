const assert = require('assert');
const bcrypt = require('bcrypt');
const helper = require('../../helper');
const models = require('../../../server/models');

describe('models.User', () => {
  beforeEach(async () => {
    await helper.loadFixtures(['organizations', 'users']);
  });

  it('creates a new Operational User in the C4SF Organization', async () => {
    const user = await models.User.create({
      OrganizationId: 'aac13870-f6f3-11ea-adc1-0242ac120002',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@test.com',
      password: 'Abcd1234!',
      isOperationalUser: true,
      CreatedById: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      UpdatedById: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    });
    assert(user);
    assert(user.id);
    assert.deepStrictEqual(user.firstName, 'John');
    assert.deepStrictEqual(user.lastName, 'Doe');
    assert.deepStrictEqual(user.email, 'john.doe@test.com');
    assert(user.isOperationalUser);
    assert(!user.isAdminUser);
    assert(!user.isSuperUser);
    assert(user.hashedPassword);
    assert(user.createdAt);
    assert(user.updatedAt);
    assert(await bcrypt.compare('Abcd1234!', user.hashedPassword));
  });
});
