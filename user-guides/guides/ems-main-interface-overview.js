const { loginEMS } = require('../src/snippets');

module.exports = {
  title: 'Main Interface Overview',
  script: [
    ...loginEMS,
    // wait for the Ringdown tab so Playwright will wait for it to exist after logging in.  otherwise, the screenshot may be blank.
    ['"Ringdown"', ['waitFor']],

    ({ screenshot }) => screenshot(
      'Click the Ringdown tab to send a new ringdown to a hospital.'
    ),

    ['"Hospital Info"', ['click']],
    // clear the focus ring from the tab button by clicking the <header> element
    ['header', ['click']],

    ({ screenshot }) => screenshot(
      'Click the Hospital Info tab to view the current bed availability, announcements, and number of ambulances currently en route or waiting at each hospital.'
    ),
  ]
};
