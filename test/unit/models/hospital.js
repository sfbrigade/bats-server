'use strict'

const assert = require('assert');
const helper = require('../../helper');
const models = require('../../../models');

describe('models.Hospital', function () {
  it('creates a new Hospital record', async function() {
    const hospital = await models.Hospital.create({
      hospitalName: 'San Francisco General',
      recordUpdateSource: 'test',
      recordCreateSource: 'test'
    });
    assert(hospital);
    assert(hospital.id);
    assert.deepStrictEqual(hospital.hospitalName, 'San Francisco General');
    assert.deepStrictEqual(hospital.recordUpdateSource, 'test');
    assert.deepStrictEqual(hospital.recordCreateSource, 'test');
    assert(hospital.recordUpdateTimestamp);
    assert(hospital.recordCreateTimestamp);
  });
});
