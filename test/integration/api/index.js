const HttpStatus = require('http-status-codes');
const session = require('supertest-session');

const app = require('../../../server/app');

describe('/api/health', () => {
  let testSession;
  beforeEach(async () => {
    testSession = session(app);
  });

  it('returns success', async () => {
    await testSession.get('/api/health').expect(HttpStatus.NO_CONTENT);
  });
});
