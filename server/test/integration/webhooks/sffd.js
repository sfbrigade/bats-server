const assert = require('assert');
const fs = require('fs');
const HttpStatus = require('http-status-codes');
const path = require('path');
const session = require('supertest-session');

const helper = require('../../helper');
const app = require('../../../app');
const models = require('../../../models');

describe('/webhooks/sffd', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadFixtures(['organizations', 'users', 'hospitals', 'hospitalUsers']);
    testSession = session(app);
  });

  describe('POST /cad', () => {
    it('creates Ambulance and EmergencyMedicalServiceCall records ', async () => {
      // read sample data
      const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'sffd.cad.json')));
      // post to webhook endpoint
      await testSession.post('/webhooks/sffd/cad').set('Accept', 'application/json').send(data).expect(HttpStatus.OK);

      const ambulances = await models.Ambulance.findAll();
      assert.deepStrictEqual(ambulances.length, 40);

      const emsCalls = await models.EmergencyMedicalServiceCall.findAll();
      assert.deepStrictEqual(emsCalls.length, 49);

      const emsCallsAmbulances = await models.EmergencyMedicalServiceCallAmbulance.findAll();
      assert.deepStrictEqual(emsCallsAmbulances.length, 53);
    });

    it('handles multiple Ambulance dispached to EMSCall records across separate callbacks', async () => {
      // post initial ambulance dispatch to webhook endpoint
      await testSession
        .post('/webhooks/sffd/cad')
        .set('Accept', 'application/json')
        .send([
          {
            UNIT: 'M559',
            INC_NO: '21049765',
            DISPATCH_DTTM: '2021-04-26T06:09:30Z',
            ADDRESS: 'HOWARD ST/LANGTON ST',
            PRIORITY: '3',
          },
        ])
        .expect(HttpStatus.OK);

      // now post second ambulance dispatch in the next call
      await testSession
        .post('/webhooks/sffd/cad')
        .set('Accept', 'application/json')
        .send([
          {
            UNIT: 'M562',
            INC_NO: '21049765',
            DISPATCH_DTTM: '2021-04-26T06:06:18Z',
            ADDRESS: 'HOWARD ST/LANGTON ST',
            PRIORITY: '3',
          },
        ])
        .expect(HttpStatus.OK);

      const emsCall = await models.EmergencyMedicalServiceCall.findOne({
        where: {
          dispatchCallNumber: '21049765',
        },
      });
      assert(emsCall);
      assert.deepStrictEqual(emsCall.startDateTimeLocal, new Date('2021-04-26T06:09:30Z'));

      const ambulances = await emsCall.getAmbulances();
      assert(ambulances.length, 2);
      assert(ambulances.find((ambulance) => ambulance.ambulanceIdentifier === 'M559'));
      assert(ambulances.find((ambulance) => ambulance.ambulanceIdentifier === 'M562'));
    });
  });
});
