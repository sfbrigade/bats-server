const { loginEMS } = require('../src/snippets');

module.exports = {
  title: 'Sending a Ringdown',
  script: [
    ...loginEMS,
    ['"Unit #"', ['click']],

    ({ screenshot }) => screenshot(
      'Select or enter your Unit #, which will update the Incident # menu.'
    ),

    ['li[role="option"]:has-text("SFFD-1")', ['click']],
    ['"Incident #"', ['click']],

    ({ screenshot }) => screenshot(
      'Select or enter the Incident # for the patient.'
    ),

    [['press', 'body', 'Enter']],
    ['"Code 2"', ['click']],
    ['"Age (estimated)"', 58],
    ['"Male"', ['click']],
    ['#chiefComplaintDescription', 'Chest pain'],
    ['"Vitals stable"', ['click']],
    ({ scrollToTop }) => scrollToTop('text=Patient info'),

    ({ screenshot }) => screenshot(
      'Enter all the required Patient Info, marked with a red star. '
    ),

    ({ scrollToTop }) => scrollToTop('"Vitals"'),

    ({ screenshot }) => screenshot(
      'Optionally, add Vitals and Additional notes.'
    ),

    ['"Clear Form"', ['scrollIntoViewIfNeeded']],

    ({ screenshot }) => screenshot(
      'Click Select Hospital at the end of the form.'
    ),

    ['"Select Hospital"', ['click']],

    ({ screenshot }) => screenshot(
      'Select the hospital you wish to send the ringdown to. You may switch to the Hospital Info tab at any time to review the latest hospital status updates.'
    ),

    ['label:has-text("SF General")', ['click']],
    ['"ETA"', 12],

    ({ screenshot }) => screenshot(
      'Enter your ETA and click Send Ringdown.'
    ),

    ['"Send Ringdown"', ['click']],
    ['"Mark arrived"', ['waitFor']],

    ({ screenshot }) => screenshot(
      'You will then be presented with a progress screen tracking the ringdown.'
    ),
  ]
};
