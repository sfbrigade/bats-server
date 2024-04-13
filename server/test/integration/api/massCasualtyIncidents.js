const assert = require('assert');
const HttpStatus = require('http-status-codes');
const session = require('supertest-session');

const helper = require('../../helper');
const models = require('../../../models');
const app = require('../../../app');

describe('/api/mcis', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadFixtures([
      'organizations',
      'users',
      'massCasualtyIncidents',
      'emergencyMedicalServiceCalls',
      'ambulances',
      'hospitals',
      'patients',
      'patientDeliveries',
    ]);
    testSession = session(app);
    // log in as a superuser
    await testSession
      .post('/auth/local/login')
      .set('Accept', 'application/json')
      .send({ username: 'super.user@example.com', password: 'abcd1234' })
      .expect(HttpStatus.ACCEPTED);
    // since company in fixture has mFa enabled, signing in would require twoFactor
    await helper.twoFactorAuthSession(testSession);
  });

  describe('GET /', () => {
    it('returns a paginated list of MCIs', async () => {
      const response = await testSession.get('/api/mcis');
      assert.deepStrictEqual(response.body.length, 5);
      // active first
      assert.deepStrictEqual(response.body[0].incidentNumber, '1005');
      assert.deepStrictEqual(response.body[1].incidentNumber, '1004');
      // then ended
      assert.deepStrictEqual(response.body[2].incidentNumber, '1003');
      assert.deepStrictEqual(response.body[3].incidentNumber, '1002');
      assert.deepStrictEqual(response.body[4].incidentNumber, '1001');
    });
  });

  describe('POST /', () => {
    it('creates a new MCI record', async () => {
      const response = await testSession
        .post('/api/mcis')
        .set('Accept', 'application/json')
        .send({
          incidentNumber: '1006',
          address1: '1006 Address 1',
          address2: '1006 Address 2',
          city: '2411786',
          state: '06',
          zip: '94103',
          startedAt: '2024-04-05T16:14:32-07:00',
          endedAt: '2024-04-05T18:14:32-07:00',
          estimatedRedCount: 1,
          estimatedYellowCount: 2,
          estimatedGreenCount: 3,
          estimatedZebraCount: 4,
        })
        .expect(HttpStatus.CREATED);
      const { id } = response.body;
      const record = await models.MassCasualtyIncident.findByPk(id);
      assert.deepStrictEqual(record.incidentNumber, '1006');
      assert.deepStrictEqual(record.address1, '1006 Address 1');
      assert.deepStrictEqual(record.address2, '1006 Address 2');
      assert.deepStrictEqual(record.city, '2411786');
      assert.deepStrictEqual(record.state, '06');
      assert.deepStrictEqual(record.zip, '94103');
      assert.deepStrictEqual(record.startedAt, new Date('2024-04-05T16:14:32-07:00'));
      assert.deepStrictEqual(record.endedAt, new Date('2024-04-05T18:14:32-07:00'));
      assert.deepStrictEqual(record.estimatedRedCount, 1);
      assert.deepStrictEqual(record.estimatedYellowCount, 2);
      assert.deepStrictEqual(record.estimatedGreenCount, 3);
      assert.deepStrictEqual(record.estimatedZebraCount, 4);
    });

    it('updates an existing MCI record by incidentNumber', async () => {
      await testSession
        .post('/api/mcis')
        .set('Accept', 'application/json')
        .send({
          incidentNumber: '1005',
          estimatedRedCount: 1,
          estimatedYellowCount: 2,
          estimatedGreenCount: 3,
          estimatedZebraCount: 4,
        })
        .expect(HttpStatus.OK);

      const record = await models.MassCasualtyIncident.findByPk('a9362c42-f8d7-4e05-b0b6-c9e3b191c7d4');
      assert.deepStrictEqual(record.incidentNumber, '1005');
      assert.deepStrictEqual(record.address1, '2468 Also Active Ln');
      assert.deepStrictEqual(record.startedAt, new Date('2024-04-05T13:14:32-07:00'));
      assert.deepStrictEqual(record.estimatedRedCount, 1);
      assert.deepStrictEqual(record.estimatedYellowCount, 2);
      assert.deepStrictEqual(record.estimatedGreenCount, 3);
      assert.deepStrictEqual(record.estimatedZebraCount, 4);
    });
  });

  describe('GET /:id', () => {
    it('returns an existing MCI record by primary key id', async () => {
      const response = await testSession.get('/api/mcis/752f8a8a-1f14-4eb1-ae6e-5bb48a16acde');
      assert.deepStrictEqual(response.body, {
        id: '752f8a8a-1f14-4eb1-ae6e-5bb48a16acde',
        incidentNumber: '1004',
        address1: '1357 Active Way',
        address2: '',
        city: '',
        state: '',
        zip: '',
        startedAt: '2024-04-05T19:14:32.000Z',
        endedAt: null,
        estimatedRedCount: 1,
        estimatedYellowCount: 2,
        estimatedGreenCount: 3,
        estimatedZebraCount: 0,
        treatedRedCount: null,
        treatedYellowCount: null,
        treatedGreenCount: null,
        treatedZebraCount: null,
        isExternallyUpdated: false,
        CreatedById: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        createdAt: response.body.createdAt,
        UpdatedById: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        updatedAt: response.body.updatedAt,
      });
    });
  });

  describe('GET /:id/ringdowns', () => {
    it('returns ringdowns associated with the specified MCI incidentNumber', async () => {
      const response = await testSession.get('/api/mcis/752f8a8a-1f14-4eb1-ae6e-5bb48a16acde/ringdowns');
      assert.deepStrictEqual(response.body.length, 5);
    });
  });

  describe('PATCH /:id', () => {
    it('updates an existing MCI record', async () => {
      await testSession
        .patch('/api/mcis/a9362c42-f8d7-4e05-b0b6-c9e3b191c7d4')
        .set('Accept', 'application/json')
        .send({
          incidentNumber: '1006',
          address1: '1006 Address 1',
          address2: '1006 Address 2',
          city: '2411786',
          state: '06',
          zip: '94103',
          startedAt: '2024-04-05T16:14:32-07:00',
          endedAt: '2024-04-05T18:14:32-07:00',
          estimatedRedCount: 1,
          estimatedYellowCount: 2,
          estimatedGreenCount: 3,
          estimatedZebraCount: 4,
        })
        .expect(HttpStatus.OK);
      const record = await models.MassCasualtyIncident.findByPk('a9362c42-f8d7-4e05-b0b6-c9e3b191c7d4');
      assert.deepStrictEqual(record.incidentNumber, '1006');
      assert.deepStrictEqual(record.address1, '1006 Address 1');
      assert.deepStrictEqual(record.address2, '1006 Address 2');
      assert.deepStrictEqual(record.city, '2411786');
      assert.deepStrictEqual(record.state, '06');
      assert.deepStrictEqual(record.zip, '94103');
      assert.deepStrictEqual(record.startedAt, new Date('2024-04-05T16:14:32-07:00'));
      assert.deepStrictEqual(record.endedAt, new Date('2024-04-05T18:14:32-07:00'));
      assert.deepStrictEqual(record.estimatedRedCount, 1);
      assert.deepStrictEqual(record.estimatedYellowCount, 2);
      assert.deepStrictEqual(record.estimatedGreenCount, 3);
      assert.deepStrictEqual(record.estimatedZebraCount, 4);
    });
  });
});
