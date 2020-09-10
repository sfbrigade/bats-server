"use strict";

const assert = require("assert");
const helper = require("../../helper");
const models = require("../../../models");

describe("models.Patientdelivery", function () {

    it("creates a new PatientDelivery record", async function () {
        const PatientDelivery = await models.PatientDelivery.create({
            Id: "7f666fe4-dbdd-4c7f-ab44-d9157379a680",
            AmbulanceId: "136cf75e-55e8-4c31-a6bb-a90434ca9f18",
            PatientId: "136cf75e-55e8-4c31-a6bb-a90434ca9f18",
            HospitalId: "7f666fe4-dbdd-4c7f-ab44-d9157379a680",
            DeliveryStatus: "test",
            DepartureDateTime: "2004-10-19 10:23:54+02",
            EstimatedArrivalTime: "2004-10-19 10:23:54+02",
            ArrivalDateTime: "2004-10-19 10:23:54+02",
            AdmissionDateTime: "2004-10-19 10:23:54+02",
            RecordCreateTimestamp: "2004-10-19 10:23:54+02",
            RecordCreateSource: "test",
            RecordUpdateTimestamp: "2004-10-19 10:23:54+02",
            RecordUpdateSource: "test",

        });
        assert(PatientDelivery);
        assert(patientDelivery.id);
        assert(patient.ambulance_uuid);
        assert.deepStrictEqual(Patient_uuid);
        assert.deepStrictEqual(Hospital_uuid);
        assert.deepStrictEqual(PatientDelivery.DeliveryStatus, "test");
        assert.deepStrictEqual(PatientDelivery.DepartureDateTime);
        assert.deepStrictEqual(PatientDelivery.EstimatedArrivalTime);
        assert.deepStrictEqual(PatientDelivery.ArrivalDateTime);
        assert.deepStrictEqual(PatientDelivery.AdmissionDateTime);
        assert.deepStrictEqual(PatientDelivery.RecordCreateTimestamp);
        assert.deepStrictEqual(PatientDelivery.RecordCreateSource, "test");
        assert.deepStrictEqual(PatientDelivery.RecordUpdateTimestamp);
        assert.deepStrictEqual(PatientDelivery.RecordUpdateSource, "test");

    });
});
