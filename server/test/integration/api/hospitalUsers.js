const assert = require('assert');
const HttpStatus = require('http-status-codes');
const session = require('supertest-session');

const helper = require('../../helper');
const app = require('../../../app');
const models = require('../../../models');

describe('/api/hospitalUsers', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadFixtures(['users', 'organizations', 'hospitals', 'hospitalUsers']);
    testSession = session(app);
  });

  describe('as a superuser', () => {
    beforeEach(async () => {
      // log in as a superuser
      await testSession
        .post('/auth/local/login')
        .set('Accept', 'application/json')
        .send({ username: 'super.user@example.com', password: 'abcd1234' })
        .expect(HttpStatus.ACCEPTED);
      await helper.twoFactorAuthSession(testSession);
    });

    describe('GET /', () => {
      it('returns all HospitalUser records for a Hospital', async () => {
        const response = await testSession
          .get('/api/hospitalusers?hospitalId=7f666fe4-dbdd-4c7f-ab44-d9157379a680')
          .set('Accept', 'application/json')
          .expect(HttpStatus.OK);

        const records = response.body;
        assert.deepStrictEqual(records.length, 2);
        assert.deepStrictEqual(records[0].user?.email, 'sutter.admin@example.com');
        assert.deepStrictEqual(records[1].user?.email, 'sutter.operational@example.com');
      });

      it('returns all HospitalUser records for a User', async () => {
        const response = await testSession
          .get('/api/hospitalusers?userId=449b1f54-7583-417c-8c25-8da7dde65f6d')
          .set('Accept', 'application/json')
          .expect(HttpStatus.OK);

        const records = response.body;
        assert.deepStrictEqual(records.length, 1);
        assert.deepStrictEqual(records[0].hospital?.name, 'CPMC Davies');
      });
    });
    /*
    describe('POST /', () => {
      it('creates a new Hospital for an Organization', async () => {
        const response = await testSession
          .post('/api/hospitals')
          .send({
            OrganizationId: '25ffdd7c-b4cf-4ebb-9750-1e628370e13b',
            name: 'CPMC Mission Bernal',
            state: '06',
            stateFacilityCode: '20050',
            isActive: true,
          })
          .set('Accept', 'application/json')
          .expect(HttpStatus.CREATED);

        assert.ok(response.body.id);
        const record = await models.Hospital.findByPk(response.body.id);
        assert.deepStrictEqual(record.OrganizationId, '25ffdd7c-b4cf-4ebb-9750-1e628370e13b');
        assert.deepStrictEqual(record.name, 'CPMC Mission Bernal');
        assert.deepStrictEqual(record.state, '06');
        assert.deepStrictEqual(record.stateFacilityCode, '20050');
        assert.deepStrictEqual(record.isActive, true);
      });
    });

    describe('GET /:id', () => {
      it('returns an existing Hospital record', async () => {
        const response = await testSession
          .get('/api/hospitals/00752f60-068f-11eb-adc1-0242ac120002')
          .set('Accept', 'application/json')
          .expect(HttpStatus.OK);
        const record = response.body;
        assert.deepStrictEqual(record.name, 'CPMC Van Ness');
        assert.deepStrictEqual(record.state, '06');
        assert.deepStrictEqual(record.stateFacilityCode, '62636');
        assert.deepStrictEqual(record.isActive, true);
      });
    });

    describe('PATCH /:id', () => {
      it('updates an existing Hospital record', async () => {
        await testSession
          .patch('/api/hospitals/00752f60-068f-11eb-adc1-0242ac120002')
          .send({
            name: 'CPMC Van Ness Campus',
            state: '25',
            stateFacilityCode: '123456',
            isActive: false,
          })
          .set('Accept', 'application/json')
          .expect(HttpStatus.OK);

        const record = await models.Hospital.findByPk('00752f60-068f-11eb-adc1-0242ac120002');
        assert.deepStrictEqual(record.OrganizationId, '25ffdd7c-b4cf-4ebb-9750-1e628370e13b');
        assert.deepStrictEqual(record.name, 'CPMC Van Ness Campus');
        assert.deepStrictEqual(record.state, '25');
        assert.deepStrictEqual(record.stateFacilityCode, '123456');
        assert.deepStrictEqual(record.isActive, false);
      });
    });
    */
  });
});
