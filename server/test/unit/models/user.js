const assert = require('assert');
const bcrypt = require('bcrypt');
const { expect } = require('chai');
const nodemailermock = require('nodemailer-mock');

const helper = require('../../helper');
const models = require('../../../models');

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

  describe('.generateToTPSecret()', () => {
    it('should send out intended email with ANY provided Email Transporter', async () => {
      // Generate a secret and send it to the mock transport
      const user = await models.User.findOne({ where: { email: 'sutter.operational@example.com' } });
      await user.generateToTPSecret('twoFactor');
      // Get the sent message from the mock transport
      const sentMail = nodemailermock.mock.sentMail();
      // Expect one message to be sent
      expect(sentMail.length).to.equal(1);
      // Expect the message to be sent to the correct email address
      expect(sentMail[0].to).to.equal('sutter.operational@example.com');
      // Expect the message to have the correct subject
      expect(sentMail[0].subject).to.equal('Your Authentication Code from Routed');
      // Expect the message to have the correct text with 6 digit Authentication Code
      expect(sentMail[0].text).to.contain('Your two-factor authentication code is:');
    });
  });
});
