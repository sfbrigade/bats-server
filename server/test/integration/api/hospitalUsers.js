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

    describe('POST /', () => {
      it('creates a new HospitalUser record for a Hospital and User', async () => {
        const response = await testSession
          .post('/api/hospitalusers')
          .send({
            userId: '38f58e29-2fb8-414e-bc0a-e30109066112',
            hospitalId: '00752f60-068f-11eb-adc1-0242ac120002',
          })
          .set('Accept', 'application/json')
          .expect(HttpStatus.CREATED);

        assert.ok(response.body.id);
        const record = await models.HospitalUser.findByPk(response.body.id);
        assert.deepStrictEqual(record.HospitalId, '00752f60-068f-11eb-adc1-0242ac120002');
        assert.deepStrictEqual(record.EdAdminUserId, '38f58e29-2fb8-414e-bc0a-e30109066112');
        assert.deepStrictEqual(record.isActive, true);
        assert.deepStrictEqual(record.isRingdownUser, true);
        assert.deepStrictEqual(record.isInfoUser, true);
      });
    });

    describe('PATCH /:id', () => {
      it('updates an existing HospitalUser record', async () => {
        await testSession
          .patch('/api/hospitalusers/a19bce9b-35ae-4df6-9603-f40150d2c7b0')
          .send({
            isActive: false,
            isInfoUser: false,
            isRingdownUser: false,
          })
          .set('Accept', 'application/json')
          .expect(HttpStatus.OK);

        const record = await models.HospitalUser.findByPk('a19bce9b-35ae-4df6-9603-f40150d2c7b0');
        assert.deepStrictEqual(record.isActive, false);
        assert.deepStrictEqual(record.isInfoUser, false);
        assert.deepStrictEqual(record.isRingdownUser, false);
      });
    });
  });
});
