"use strict";

const assert = require("assert");
const helper = require("../../helper");
const models = require("../../../models");

describe("models.Patient", function () {

    it("creates a new Patient record", async function () {
        const patient = await models.Patient.create({
            PatientId: "7f666fe4-dbdd-4c7f-ab44-d9157379a680",
            emergencyMedicalServiceCallId: "136cf75e-55e8-4c31-a6bb-a90434ca9f18",
            patientNumber: 3,
            age: 1.6,
            sex: "non-binary",
            stableIndicator: "false",
            chiefComplaintDescription: "test",
            heartRateBpm: "test",
            temperature: "test",
            systolicBloodPressure: 3,
            diastolicBloodPressure: 4,
            respiratoryRate: 120,
            oxygenSaturation: 90,
            ivIndicator: 2,
            combativeBehaviorIndicator: false,
            otherObservationNotes: "text",
            recordCreateTimestamp: "2004-10-19 10:23:54+02",
            recordCreateSource: "test",
            recordUpdateTimestamp: "2004-10-19 10:23:54+02",
            recordUpdateSource: "test",

        });
        assert(patient);
        assert(patient.id);
        assert(patient.emergencyMedicalServiceCallId);
        assert.deepStrictEqual(patient.patientNumber, 3);
        assert.deepStrictEqual(patient.age, 1.6);
        assert.deepStrictEqual(patient.sex, "non-binary");
        assert.deepStrictEqual(patient.stableIndicator, "false");
        assert.deepStrictEqual(patient.chiefComplaintDescription, "test");
        assert.deepStrictEqual(patient.heartRateBpm, "test");
        assert.deepStrictEqual(patient.temperature, "test");
        assert.deepStrictEqual(patient.systolicBloodPressure, 3);
        assert.deepStrictEqual(patient.diastolicBloodPressure, 4);
        assert.deepStrictEqual(patient.respiratoryRate, 120);
        assert.deepStrictEqual(patient.oxygenSaturation, 90);
        assert.deepStrictEqual(patient.ivIndicator, 2);
        assert.deepStrictEqual(patient.combativeBehaviorIndicator, false);
        assert.deepStrictEqual(patient.otherObservationNotes, "text");
        assert(patient.recordCreateTimestamp);
        assert(patient.recordCreateSource);
        assert(patient.recordUpdateTimestamp);
    });
});
