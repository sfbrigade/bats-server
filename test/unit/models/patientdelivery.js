import { describe } from 'mocha';

const assert = require('assert');
const helper = require('../../helper');
const models = require('../../../models');

describe('models.PatientDelivery', () => {
  beforeEach(async () => {
    await helper.loadFixtures(['patient']);
  });

  it('creates a new PatientDelivery record', async (PatientDelivery) => {
    const [patientdelivery] = await Promise.all([
      models.PatientDelivery.create({
        Id: '7f666fe4-dbdd-4c7f-ab44-d9157379a680',
        AmbulanceId: '136cf75e-55e8-4c31-a6bb-a90434ca9f18',
        PatientId: '136cf75e-55e8-4c31-a6bb-a90434ca9f18',
        HospitalId: '7f666fe4-dbdd-4c7f-ab44-d9157379a680',
        DeliveryStatus: 'test',
        DepartureDateTime: '2004-10-19 10:23:54+02',
        EstimatedArrivalTime: '2004-10-19 10:23:54+02',
        ArrivalDateTime: '2004-10-19 10:23:54+02',
        AdmissionDateTime: '2004-10-19 10:23:54+02',
        RecordCreateTimestamp: '2004-10-19 10:23:54+02',
        RecordCreateSource: 'test',
        RecordUpdateTimestamp: '2004-10-19 10:23:54+02',
        RecordUpdateSource: 'test',
      }),
    ]);
    assert(PatientDelivery);
    assert(PatientDelivery.id);
    assert(PatientDelivery.Ambulance_uuid);
    assert.deepStrictEqual(
      PatientDelivery.PatientId,
      '136cf75e-55e8-4c31-a6bb-a90434ca9f18'
    );
    assert.deepStrictEqual(
      PatientDelivery.HospitalId,
      '7f666fe4-dbdd-4c7f-ab44-d9157379a680'
    );
    assert.deepStrictEqual(PatientDelivery.DeliveryStatus, 'test');
    assert.deepStrictEqual(
      PatientDelivery.DepartureDateTime,
      '2004-10-19 10:23:54+02'
    );
    assert.deepStrictEqual(
      PatientDelivery.EstimatedArrivalTime,
      '2004-10-19 10:23:54+02'
    );
    assert.deepStrictEqual(
      PatientDelivery.ArrivalDateTime,
      '2004-10-19 10:23:54+02'
    );
    assert.deepStrictEqual(
      PatientDelivery.AdmissionDateTime,
      '2004-10-19 10:23:54+02'
    );
    assert.deepStrictEqual(
      PatientDelivery.RecordCreateTimestamp,
      '2004-10-19 10:23:54+02'
    );
    assert.deepStrictEqual(PatientDelivery.RecordCreateSource, 'test');
    assert.deepStrictEqual(
      PatientDelivery.RecordUpdateTimestamp,
      '2004-10-19 10:23:54+02'
    );
    assert.deepStrictEqual(PatientDelivery.RecordUpdateSource, 'test');
  });
});
