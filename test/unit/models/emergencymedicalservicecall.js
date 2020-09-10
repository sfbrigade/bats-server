"use strict";

const assert = require("assert");
const helper = require("../../helper");
const models = require("../../../models");

describe("models.EmergencyMedicalServiceCall", function () {

    it("creates a new EmergencyMedicalServiceCall record", async function () {
        const EmergencyMedicalServiceCall = await models.EmergencyMedicalServiceCall.create({
            Id: "7f666fe4-dbdd-4c7f-ab44-d9157379a680",
            DispatchCallNumber: 1,
            StartDateTime: "2004-10-19 10:23:54+02",
            RecordCreateTimestamp: "2004-10-19 10:23:54+02",
            RecordCreateSource: "test",
            RecordUpdateTimestamp: "2004-10-19 10:23:54+02",
            RecordUpdateSource: "test",

        });
        assert(EmergencyMedicalServiceCall);
        assert(EmergencyMedicalServiceCall.id);
        assert.deepStrictEqual(EmergencyMedicalServiceCall.DispatchCallNumber, 1);
        assert.deepStrictEqual(EmergencyMedicalServiceCall.RecordCreateTimestamp);
        assert.deepStrictEqual(EmergencyMedicalServiceCall.RecordCreateSource, "test");
        assert.deepStrictEqual(EmergencyMedicalServiceCall.RecordUpdateTimestamp);
        assert.deepStrictEqual(EmergencyMedicalServiceCall.RecordUpdateSource, "test");

    });
});
