'use strict'

const assert = require('assert');
const bcrypt = require('bcrypt');
const helper = require('../../helper');
const models = require('../../../models');

describe('models.User', function () {
  it('creates a new User', async function() {
    const user = await models.User.create({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@test.com",
      password: "abcd1234!",
    });
    assert(user);
    assert(user.id);
    assert.deepStrictEqual(user.firstName, "John");
    assert.deepStrictEqual(user.lastName, "Doe");
    assert.deepStrictEqual(user.email, "john.doe@test.com");
    assert(!user.isSuperUser);
    assert(user.hashedPassword);
    assert(user.recordCreateTimestamp);
    assert(user.recordUpdateTimestamp);
    assert(await bcrypt.compare("abcd1234!", user.hashedPassword));
  });
});
