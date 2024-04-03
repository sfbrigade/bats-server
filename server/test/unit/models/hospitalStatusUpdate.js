const assert = require('assert');
const helper = require('../../helper');
const models = require('../../../models');

describe('models.HospitalStatusUpdate', () => {
  beforeEach(async () => {
    await helper.loadFixtures([
      'organizations',
      'users',
      'hospitals',
      'hospitalUsers',
      'hospitalStatusUpdates',
      'ambulances',
      'emergencyMedicalServiceCalls',
      'patients',
      'patientDeliveries',
      'patientDeliveryUpdates',
    ]);
  });

  it('creates a new HospitalStatusUpdate record', async () => {
    const hospitalStatusUpdate = await models.HospitalStatusUpdate.create({
      HospitalId: '7f666fe4-dbdd-4c7f-ab44-d9157379a680',
      EdAdminUserId: 'a950fed4-d996-4a41-a275-1cc4852d7664',
      updateDateTimeLocal: '2004-10-19 10:23:54+02',
      openEdBedCount: 1,
      openPsychBedCount: 3,
      bedCountUpdateDateTimeLocal: '2004-10-19 10:23:54+02',
      divertStatusIndicator: false,
      divertStatusUpdateDateTimeLocal: '2004-10-19 10:23:54+02',
      additionalServiceAvailabilityNotes: 'Notes',
      notesUpdateDateTimeLocal: '2004-10-19 10:23:54+02',
      CreatedById: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      UpdatedById: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    });
    assert(hospitalStatusUpdate);
    assert(hospitalStatusUpdate.id);
    assert.deepStrictEqual(hospitalStatusUpdate.updateDateTimeLocal, new Date('2004-10-19T08:23:54.000Z'));
    assert.deepStrictEqual(hospitalStatusUpdate.openEdBedCount, 1);
    assert.deepStrictEqual(hospitalStatusUpdate.openPsychBedCount, 3);
    assert.deepStrictEqual(hospitalStatusUpdate.bedCountUpdateDateTimeLocal, new Date('2004-10-19T08:23:54.000Z'));
    assert.deepStrictEqual(hospitalStatusUpdate.divertStatusIndicator, false);
    assert.deepStrictEqual(hospitalStatusUpdate.divertStatusUpdateDateTimeLocal, new Date('2004-10-19T08:23:54.000Z'));
    assert.deepStrictEqual(hospitalStatusUpdate.additionalServiceAvailabilityNotes, 'Notes');
    assert.deepStrictEqual(hospitalStatusUpdate.notesUpdateDateTimeLocal, new Date('2004-10-19T08:23:54.000Z'));
    assert(hospitalStatusUpdate.createdAt);
    assert(hospitalStatusUpdate.updatedAt);

    const createdBy = await hospitalStatusUpdate.getCreatedBy();
    assert(createdBy);
    assert.deepStrictEqual(createdBy.name, 'Super User');

    const updatedBy = await hospitalStatusUpdate.getUpdatedBy();
    assert(updatedBy);
    assert.deepStrictEqual(updatedBy.name, 'Super User');

    const hospital = await hospitalStatusUpdate.getHospital();
    assert.deepStrictEqual(hospital.name, 'CPMC Davies Campus');

    const hospitalAdmin = await hospitalStatusUpdate.getEdAdminUser();
    assert.deepStrictEqual(hospitalAdmin.name, 'Sutter Admin');
  });

  describe("scope('latest')", () => {
    it('returns only the latest status update per hospital', async () => {
      const hospitalStatusUpdates = await models.HospitalStatusUpdate.scope('latest').findAll({
        include: [models.Hospital],
      });
      // should only return one update per the 2 hospitals
      assert.deepStrictEqual(hospitalStatusUpdates.length, 2);
      // each update should reflect the latest (test data year 2005 vs 2004)
      assert.deepStrictEqual(hospitalStatusUpdates[0].Hospital.name, 'Sutter Hospital');
      assert.deepStrictEqual(hospitalStatusUpdates[0].updateDateTimeLocal.getFullYear(), 2005);
      assert.deepStrictEqual(hospitalStatusUpdates[1].Hospital.name, 'CPMC Davies Campus');
      assert.deepStrictEqual(hospitalStatusUpdates[1].updateDateTimeLocal.getFullYear(), 2005);
    });
  });

  describe('getLatestUpdatesWithAmbulanceCounts()', () => {
    it('returns the latest status update for all hospitals, with ambulance counts', async () => {
      const hospitalStatusUpdates = await models.HospitalStatusUpdate.getLatestUpdatesWithAmbulanceCounts();
      // should only return one update per the 2 hospitals
      assert.deepStrictEqual(hospitalStatusUpdates.length, 2);
      // each update should reflect the latest (test data year 2005 vs 2004)
      assert.deepStrictEqual(hospitalStatusUpdates[0].Hospital.name, 'Sutter Hospital');
      assert.deepStrictEqual(hospitalStatusUpdates[0].updateDateTimeLocal.getFullYear(), 2005);
      assert.deepStrictEqual(hospitalStatusUpdates[0].Hospital.ambulanceCounts.enRoute, 2);
      assert.deepStrictEqual(hospitalStatusUpdates[0].Hospital.ambulanceCounts.offloading, 0);
      assert.deepStrictEqual(hospitalStatusUpdates[1].Hospital.name, 'CPMC Davies Campus');
      assert.deepStrictEqual(hospitalStatusUpdates[1].updateDateTimeLocal.getFullYear(), 2005);
      assert.deepStrictEqual(hospitalStatusUpdates[1].Hospital.ambulanceCounts.enRoute, 1);
      assert.deepStrictEqual(hospitalStatusUpdates[1].Hospital.ambulanceCounts.offloading, 1);
    });
  });

  describe('toJSON()', () => {
    it('serializes out the status update with hospital ambulance counts', async () => {
      const hospitalStatusUpdate = await models.HospitalStatusUpdate.findByPk('9169fb04-b262-42ee-9c81-da1bb6818e6b');
      const json = await hospitalStatusUpdate.toJSON();
      assert.deepStrictEqual(json, {
        id: '9169fb04-b262-42ee-9c81-da1bb6818e6b',
        mciRedCapacity: null,
        mciYellowCapacity: null,
        mciGreenCapacity: null,
        mciUpdateDateTime: null,
        openEdBedCount: 10,
        openPsychBedCount: 2,
        bedCountUpdateDateTimeLocal: new Date('2004-10-19T10:23:54.000Z'),
        divertStatusIndicator: false,
        divertStatusUpdateDateTimeLocal: new Date('2004-10-19T10:23:54.000Z'),
        additionalServiceAvailabilityNotes: null,
        notesUpdateDateTimeLocal: null,
        updateDateTimeLocal: new Date('2005-10-19T10:23:54.000Z'),
        edAdminUserId: '449b1f54-7583-417c-8c25-8da7dde65f6d',
        createdById: '449b1f54-7583-417c-8c25-8da7dde65f6d',
        updatedById: '449b1f54-7583-417c-8c25-8da7dde65f6d',
        hospital: {
          id: '7f666fe4-dbdd-4c7f-ab44-d9157379a680',
          name: 'CPMC Davies Campus',
          state: '06',
          stateFacilityCode: '20048',
          sortSequenceNumber: 2,
          ambulancesEnRoute: 1,
          ambulancesOffloading: 1,
        },
      });
    });
  });
});
