/* eslint-env mocha */

const { expect } = require('chai');
const nodemailermock = require('nodemailer-mock');
const HttpStatus = require('http-status-codes');
const session = require('supertest-session');

const helper = require('../../helper');
const app = require('../../../app');

describe('/auth/local', async () => {
  let testSession = null;
  beforeEach(async () => {
    // load fixtures
    await helper.loadFixtures(['organizations', 'users', 'ambulances']);
    testSession = session(app);
  });

  describe('POST /login', () => {
    it('should send the email with code for a user in an org with MFA enabled', async () => {
      await testSession
        .post('/auth/local/login')
        .set('Accept', 'application/json')
        .send({ username: 'super.user@example.com', password: 'abcd1234' })
        .expect(HttpStatus.ACCEPTED);

      const sentMail = nodemailermock.mock.sentMail();
      // Expect one message to be sent
      expect(sentMail.length).to.equal(1);
      // Expect the message to be sent to the correct email address
      expect(sentMail[0].to).to.equal('super.user@example.com');
      // Expect the message to have the correct subject
      expect(sentMail[0].subject).to.equal('Your Authentication Code from Routed');
      // Expect the message to have the correct text with 6 digit Authentication Code
      expect(sentMail[0].text).to.contain('Your two-factor authentication code is:');
    });

    it('should return unauthorized for invalid credentials', async () => {
      // Attempt an invalid Log In
      await testSession
        .post('/auth/local/login')
        .set('Accept', 'application/json')
        .send({ username: 'incorrect.user@example.com', password: 'barfoo' })
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('POST /twoFactor', () => {
    it('should correctly authenticate with ToTP secret', async () => {
      // After Inital Log In, the user should be redirected to the twoFactor auth page
      await testSession
        .post('/auth/local/login')
        .set('Accept', 'application/json')
        .send({ username: 'super.user@example.com', password: 'abcd1234' })
        .expect(HttpStatus.ACCEPTED);

      const sentMail = nodemailermock.mock.sentMail();
      // Extract authentication code from the sent email
      const regex = /Your two-factor authentication code is: (\d{6})/;
      const match = regex.exec(sentMail[0].text);
      const authCode = match[1];
      // Submit the authentication code
      const response = await testSession.post('/auth/local/twoFactor').set('Accept', 'application/json').send({ code: authCode });
      // Expect to be redirected to the home page
      expect(response.status).to.equal(HttpStatus.OK);
    });
  });
});
