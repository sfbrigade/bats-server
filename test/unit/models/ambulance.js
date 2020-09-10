"use strict";

const assert = require("assert");
const helper = require("../../helper");
const models = require("../../../models");

describe("models.Ambulance", function () {

    it("creates a new Ambulance record", async function () {
        const Ambulance = await models.Ambulance.create({
            Id: "7f666fe4-dbdd-4c7f-ab44-d9157379a680",
            EmergencyMedicalServiceProviderId: "136cf75e-55e8-4c31-a6bb-a90434ca9f18",
            AmbulanceIdentifier: "test",
            RecordCreateTimestamp: "2004-10-19 10:23:54+02",
            RecordCreateSource: "test",
            RecordUpdateTimestamp: "2004-10-19 10:23:54+02",
            RecordUpdateSource: "test",

        });
        assert(Ambulance);
        assert(Ambulance.id);
        assert(Ambulance.EmergencyMedicalServiceProvider_uuid);
        assert.deepStrictEqual(Ambulance.AmbulanceIdentifier, "test");
        assert.deepStrictEqual(Ambulance.RecordCreateTimestamp);
        assert.deepStrictEqual(Ambulance.RecordCreateSource, "test");
        assert.deepStrictEqual(Ambulance.RecordUpdateTimestamp);
        assert.deepStrictEqual(Ambulance.RecordUpdateSource, "test");

    });
});
