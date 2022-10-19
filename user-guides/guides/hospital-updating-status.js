const { loginHospital } = require('../src/snippets');

module.exports = {
  title: 'Updating Hospital Status',
  seeders: [
    'create-3-confirmed-ringdowns.js'
  ],
  script: [
    ...loginHospital,
    // wait for the notes field.  if we don't, some of the UI may not be rendered before the screenshot is taken.
    ['#additionalNotes', ['waitFor']],

    ({ screenshot }) => screenshot(
      'Click the Update Hospital Info button to edit the number of Available Beds or the ER conditions.'
    ),

    ['"Update Hospital Info"', ['click']],
    [':nth-match(:text("+"), 1)', ['click']],
    [':nth-match(:text("+"), 1)', ['click']],
    [':nth-match(:text("+"), 1)', ['click']],
    [':nth-match(:text("+"), 1)', ['click']],

    [':nth-match(:text("+"), 2)', ['click']],
    [':nth-match(:text("+"), 2)', ['click']],

    ['#additionalNotes', 'CT scanner down'],

    ({ screenshot }) => screenshot(
      'Click the + or - buttons next to the bed counts to increase or decrease the bed counts, respectively. Type any ER conditions notes in the text box. Click Confirm Updates to make these changes visible to EMS teams.\n'
    ),
  ]
};
