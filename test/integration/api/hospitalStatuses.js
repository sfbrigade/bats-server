const assert = require('assert');
const HttpStatus = require('http-status-codes');
const session = require('supertest-session');

const helper = require('../../helper');
const app = require('../../../app');

describe('/api/hospitalstatuses', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadFixtures(['users', 'organizations', 'hospitals', 'hospitalUsers', 'hospitalStatusUpdates']);
    testSession = session(app);
    await testSession
      .post('/auth/local/login')
      .set('Accept', 'application/json')
      .send({ username: 'regular.user@example.com', password: 'abcd1234' });
  });

  describe('GET /', () => {
    it('returns a list of the latest status updates per hosptial', async () => {
      const response = await testSession.get('/api/hospitalstatuses').set('Accept', 'application/json').expect(HttpStatus.OK);

      assert.deepStrictEqual(response.body.length, 2);
      const cpmcHospital = response.body.filter((hospital) => hospital.id === '7f666fe4-dbdd-4c7f-ab44-d9157379a680')[0];
      assert(cpmcHospital.updateDatetime);
      assert.deepStrictEqual(cpmcHospital.openEdBedCount, 10);
      assert.deepStrictEqual(cpmcHospital.divertStatusIndicator, false);
      const sutterHospital = response.body.filter((hospital) => hospital.id === '00752f60-068f-11eb-adc1-0242ac120002')[0];
      assert(sutterHospital.updateDatetime);
      assert.deepStrictEqual(sutterHospital.openEdBedCount, 0);
      assert.deepStrictEqual(sutterHospital.divertStatusIndicator, true);
    });
  });

  describe('POST /', () => {
    it('creates a new hospital status update', async () => {
      const response = await testSession
        .post('/api/hospitalstatuses')
        .set('Accept', 'application/json')
        .send({
          HospitalId: '7f666fe4-dbdd-4c7f-ab44-d9157379a680',
          EdAdminUserId: 'a950fed4-d996-4a41-a275-1cc4852d7664',
          openEdBedCount: 5,
          divertStatusIndicator: false,
        })
        .expect(HttpStatus.CREATED);

      assert(response.body.id);
      assert.deepStrictEqual(response.body.HospitalId, '7f666fe4-dbdd-4c7f-ab44-d9157379a680');
      assert.deepStrictEqual(response.body.EdAdminUserId, 'a950fed4-d996-4a41-a275-1cc4852d7664');
      assert.deepStrictEqual(response.body.openEdBedCount, 5);
      assert.deepStrictEqual(response.body.divertStatusIndicator, false);
    });
  });
});
