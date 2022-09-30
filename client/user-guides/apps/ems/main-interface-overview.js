const { loginEMS } = require('./utils/snippets');

module.exports = {
  script: [
    ...loginEMS,
    // click the Ringdown tab so Playwright will wait for it to exist after logging in.  otherwise, the screenshot may be blank.
    ['"Ringdown"', ['click']],

    'screenshot',

    ['"Hospital Info"', ['click']],

    'screenshot',
  ]
};
