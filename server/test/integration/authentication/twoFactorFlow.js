/* eslint-env mocha */

const { expect } = require('chai');
const nodemailermock = require('nodemailer-mock');
const HttpStatus = require('http-status-codes');
const session = require('supertest-session');

const helper = require('../../helper');
const app = require('../../../app');
const model = require('../../../models');
const { createTransport } = require('../../../mailer/emailTransporter');

describe('Two Factor Page', async () => {
  let testSession = null;
  beforeEach(async () => {
    // load fixtures
    await helper.loadFixtures(['organizations', 'users', 'ambulances']);
  });

  it(' should reach the twoFactor auth page after initial log in ', async () => {
    testSession = session(app);

    // After Inital Log In, the user should be redirected to the twoFactor auth page
    await testSession
      .post('/auth/local/login')
      .set('Accept', 'application/json')
      .send({ username: 'sutter.operational@example.com', password: 'abcd1234' })
      .expect(HttpStatus.OK);
    // Call the two-factor authentication endpoint
    const response = await testSession.get('/auth/local/twoFactor').set('Accept', 'application/json');
    // Check that the response has the correct content
    expect(response.text).to.contain('Please enter the Authorization Code that was sent to your E-mail');
    expect(response.text).to.contain('Submit');
  });

  it(' should not reach the twoFactor auth page if not initally logged in', async () => {
    testSession = session(app);
    // Attempt an invalid Log In
    await testSession
      .post('/auth/local/login')
      .set('Accept', 'application/json')
      .send({ username: 'incorrect.user@example.com', password: 'barfoo' })
      .expect(HttpStatus.UNAUTHORIZED);
    // Call the two-factor authentication endpoint
    const response = await testSession.get('/auth/local/twoFactor').set('Accept', 'application/json');
    // Expect 302 redirect
    expect(response.status).to.equal(HttpStatus.MOVED_TEMPORARILY);
    // Expect redirect to login page
    expect(response.header.location).to.equal('/auth/local/login');
  });
});

describe('Email Functionality', async () => {
  let testSession = null;

  beforeEach(async () => {
    // load fixtures
    await helper.loadFixtures(['organizations', 'users', 'ambulances']);
  });

  it('should send out intended email with ANY provided Email Transporter', async () => {
    // Create a mock transport
    const transport = createTransport();
    // Generate a secret and send it to the mock transport
    const user = await model.User.findOne({ where: { email: 'sutter.operational@example.com' } });
    await user.generateToTPSecret('test123@gmail.com', transport);
    // Get the sent message from the mock transport
    const sentMail = nodemailermock.mock.sentMail();
    // Expect one message to be sent
    expect(sentMail.length).to.equal(1);
    // Expect the message to be sent to the correct email address
    expect(sentMail[0].to).to.equal('sutter.operational@example.com');
    // Expect the message to have the correct subject
    expect(sentMail[0].subject).to.equal('Your Authentication Code from Routed');
    // Expect the message to have the correct text with 6 digit Authentication Code
    expect(sentMail[0].text).to.contain('This is your Authentication Code:');
  });

  it('E2E - should correctly authenticate with ToTP secret', async () => {
    testSession = session(app);
    // After Inital Log In, the user should be redirected to the twoFactor auth page
    await testSession
      .post('/auth/local/login')
      .set('Accept', 'application/json')
      .send({ username: 'sutter.operational@example.com', password: 'abcd1234' })
      .expect(HttpStatus.OK);
    // Go to Two Factor Auth Page
    await testSession.get('/auth/local/twoFactor').set('Accept', 'application/json');
    const sentMail = nodemailermock.mock.sentMail();
    // Extract authentication code from the sent email
    const regex = /Authentication Code: (\d{6})/;
    const match = regex.exec(sentMail[0].text);
    const authCode = match[1];
    // Submit the authentication code
    const response = await testSession.post('/auth/local/twoFactor').set('Accept', 'application/json').send({ code: authCode });
    // Expect to be redirected to the home page
    expect(response.status).to.equal(HttpStatus.MOVED_TEMPORARILY);
    expect(response.header.location).to.equal('/');
  });
});
