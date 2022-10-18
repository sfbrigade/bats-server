const { loginHospital } = require('../src/snippets');

module.exports = {
  title: 'Main Interface Overview',
  script: [
    ...loginHospital,
    // click the Ringdown tab so Playwright will wait for it to exist after logging in.  otherwise, the screenshot may be blank.
    ['"Ringdown"', ['click']],

    ({ screenshot }) => screenshot(
      'Click the Ringdown tab to see the list of Waiting and Incoming ambulances. The total number of ambulances for each section is shown next to the header. Note: the Ringdown tab is not visible to the Administrator-on-Duty (AOD) user.'
    ),

    ['"Hospital Info"', ['click']],

    ({ screenshot }) => screenshot(
      'Click the Hospital Info tab to view and update the current bed availability and announcements shared in the system. The red incoming alert summarizes the total number of ambulances arriving at the hospital, so you don\'t have to switch back to the Ringdown tab.'
    ),
  ]
};
