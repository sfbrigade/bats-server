const { loginHospital } = require('../utils/snippets');

module.exports = {
  title: 'Receiving a New Ringdown',
  script: [
    ...loginHospital,
    ['"Hospital Info"', ['waitFor']],
      // wait briefly for the icon next to the incoming count to render.  if we don't, it doesn't show up in the first screenshot.
    [['waitForTimeout', 500]],

    ({ screenshot }) => screenshot(
      'New incoming ringdowns will appear in an alert box at the bottom of the interface.'
    ),

      // since there are multiple More info links, specify the first one
    [':nth-match(:text("More info"), 1)', ['click']],

    ({ screenshot }) => screenshot(
      'Click More info to expand the alert and view the details of the ringdown. Click Confirm Receipt to acknowledge the ringdown and dismiss the alert.'
    ),
  ]
};
