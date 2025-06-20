const assert = require('assert');
const HttpStatus = require('http-status-codes');
const session = require('supertest-session');

const helper = require('../../helper');
const app = require('../../../app');
const models = require('../../../models');

describe('/api/hospitals', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadFixtures(['users', 'organizations', 'hospitals']);
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
      it('returns all Hospitals in sortSequenceNumber order', async () => {
        const response = await testSession.get('/api/hospitals').set('Accept', 'application/json').expect(HttpStatus.OK);

        const records = response.body;
        assert.deepStrictEqual(records.length, 2);
        assert.deepStrictEqual(records[0].name, 'CPMC Van Ness');
        assert.deepStrictEqual(records[1].name, 'CPMC Davies');
      });
    });

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
            customInventory: ['ICU Beds', 'Ventilators'],
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
        assert.deepStrictEqual(record.customInventory, ['ICU Beds', 'Ventilators']);

        const statusUpdate = await models.HospitalStatusUpdate.findOne({ where: { HospitalId: record.id } });
        assert.ok(statusUpdate);
        assert.deepStrictEqual(statusUpdate.openEdBedCount, 0);
        assert.deepStrictEqual(statusUpdate.customInventoryCount, [0, 0]);
      });
    });

    describe('PUT /:id', () => {
      it('updates an existing Hospital record', async () => {
        const response = await testSession
          .put('/api/hospitals/00752f60-068f-11eb-adc1-0242ac120002')
          .send({
            name: 'CPMC Van Ness Updated',
            state: '25',
            stateFacilityCode: '99999',
            sortSequenceNumber: 5,
            isActive: false,
            customInventory: ['Ventilators'],
          })
          .set('Accept', 'application/json')
          .expect(HttpStatus.OK);

        const data = response.body;
        assert.deepStrictEqual(data.name, 'CPMC Van Ness Updated');
        assert.deepStrictEqual(data.state, '25');
        assert.deepStrictEqual(data.stateFacilityCode, '99999');
        assert.deepStrictEqual(data.sortSequenceNumber, 5);
        assert.deepStrictEqual(data.isActive, false);
        assert.deepStrictEqual(data.customInventory, ['Ventilators']);

        const record = await models.Hospital.findByPk('00752f60-068f-11eb-adc1-0242ac120002');
        assert.deepStrictEqual(record.name, 'CPMC Van Ness Updated');
        assert.deepStrictEqual(record.state, '25');
        assert.deepStrictEqual(record.stateFacilityCode, '99999');
        assert.deepStrictEqual(record.sortSequenceNumber, 5);
        assert.deepStrictEqual(record.isActive, false);
        assert.deepStrictEqual(record.customInventory, ['Ventilators']);

        // Verify status update was created with new customInventory
        const statusUpdate = await models.HospitalStatusUpdate.findOne({
          where: { HospitalId: '00752f60-068f-11eb-adc1-0242ac120002' },
          order: [['updateDateTimeLocal', 'DESC']],
        });
        assert.ok(statusUpdate);
        assert.deepStrictEqual(statusUpdate.customInventoryCount, [0]);
      });

      it('creates a new Hospital record with specified ID if it does not exist', async () => {
        const newId = '11111111-1111-1111-1111-111111111111';
        const response = await testSession
          .put(`/api/hospitals/${newId}`)
          .send({
            OrganizationId: '25ffdd7c-b4cf-4ebb-9750-1e628370e13b',
            name: 'New Hospital',
            state: '06',
            stateFacilityCode: '12345',
            sortSequenceNumber: 3,
            isActive: true,
            customInventory: ['ICU Beds', 'Ventilators'],
          })
          .set('Accept', 'application/json')
          .expect(HttpStatus.OK);

        const data = response.body;
        assert.deepStrictEqual(data.name, 'New Hospital');
        assert.deepStrictEqual(data.state, '06');
        assert.deepStrictEqual(data.stateFacilityCode, '12345');
        assert.deepStrictEqual(data.sortSequenceNumber, 3);
        assert.deepStrictEqual(data.isActive, true);
        assert.deepStrictEqual(data.customInventory, ['ICU Beds', 'Ventilators']);

        const record = await models.Hospital.findByPk(newId);
        assert.ok(record);
        assert.deepStrictEqual(record.OrganizationId, '25ffdd7c-b4cf-4ebb-9750-1e628370e13b');
        assert.deepStrictEqual(record.name, 'New Hospital');
        assert.deepStrictEqual(record.state, '06');
        assert.deepStrictEqual(record.stateFacilityCode, '12345');
        assert.deepStrictEqual(record.sortSequenceNumber, 3);
        assert.deepStrictEqual(record.isActive, true);
        assert.deepStrictEqual(record.customInventory, ['ICU Beds', 'Ventilators']);

        // Verify initial status update was created
        const statusUpdate = await models.HospitalStatusUpdate.findOne({ where: { HospitalId: newId } });
        assert.ok(statusUpdate);
        assert.deepStrictEqual(statusUpdate.openEdBedCount, 0);
        assert.deepStrictEqual(statusUpdate.openPsychBedCount, 0);
        assert.deepStrictEqual(statusUpdate.customInventoryCount, [0, 0]);
        assert.deepStrictEqual(statusUpdate.divertStatusIndicator, false);
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

    describe('PATCH /sort', () => {
      it('bulk updates the sort sequence of the specified hospital records', async () => {
        await testSession
          .patch('/api/hospitals/sort')
          .send([
            {
              id: '7f666fe4-dbdd-4c7f-ab44-d9157379a680',
              sortSequenceNumber: 1,
            },
            {
              id: '00752f60-068f-11eb-adc1-0242ac120002',
              sortSequenceNumber: 2,
            },
          ])
          .set('Accept', 'application/json')
          .expect(HttpStatus.OK);

        let record = await models.Hospital.findByPk('7f666fe4-dbdd-4c7f-ab44-d9157379a680');
        assert.deepStrictEqual(record.sortSequenceNumber, 1);

        record = await models.Hospital.findByPk('00752f60-068f-11eb-adc1-0242ac120002');
        assert.deepStrictEqual(record.sortSequenceNumber, 2);
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
            customInventory: ['ICU Beds', 'Ventilators', 'PPE'],
          })
          .set('Accept', 'application/json')
          .expect(HttpStatus.OK);

        const record = await models.Hospital.findByPk('00752f60-068f-11eb-adc1-0242ac120002');
        assert.deepStrictEqual(record.OrganizationId, '25ffdd7c-b4cf-4ebb-9750-1e628370e13b');
        assert.deepStrictEqual(record.name, 'CPMC Van Ness Campus');
        assert.deepStrictEqual(record.state, '25');
        assert.deepStrictEqual(record.stateFacilityCode, '123456');
        assert.deepStrictEqual(record.isActive, false);
        assert.deepStrictEqual(record.customInventory, ['ICU Beds', 'Ventilators', 'PPE']);

        // Verify status update was created with new customInventory
        const statusUpdate = await models.HospitalStatusUpdate.findOne({
          where: { HospitalId: '00752f60-068f-11eb-adc1-0242ac120002' },
          order: [['updateDateTimeLocal', 'DESC']],
        });
        assert.ok(statusUpdate);
        assert.deepStrictEqual(statusUpdate.customInventoryCount, [0, 0, 0]);
      });
    });
  });
});
