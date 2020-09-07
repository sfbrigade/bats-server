const HttpStatus = require("http-status-codes");
const session = require("supertest-session");

const app = require("../../../app");

describe("/api/health", function () {
  let testSession;
  beforeEach(async function () {
    testSession = session(app);
  });

  it("returns success", async function () {
    await testSession.get("/api/health").expect(HttpStatus.NO_CONTENT);
  });
});
