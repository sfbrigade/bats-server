const { loginHospital } = require('../src/snippets');

module.exports = {
  title: 'Managing the Ringdowns List',
  seeders: [
    'create-3-confirmed-ringdowns.js'
  ],
  script: [
    ...loginHospital,
    ['"Ringdown"', ['click']],
    // click in reverse order so their index won't change, since clicking will change the class name, causing the
    // number of matches to then change
    ['.fa-caret-up.btn >> nth=1', ['click']],
    ['.fa-caret-up.btn >> nth=0', ['click']],

    ({ screenshot }) => screenshot(
      'Click the arrows next to the Waiting and Incoming headers to expand or collapse the sections.'
    ),

    ['.fa-caret-down.btn >> nth=1', ['click']],
    ['.fa-caret-down.btn >> nth=0', ['click']],
    ['"More info" >> nth=1', ['click']],

    ({ screenshot }) => screenshot(
      'Click More info to expand a ringdown and see more details.'
    ),

    ({ screenshot }) => screenshot(
      { selector: '.ringdown-card >> nth=0' },
      'Canceled status'
    ),
  ]
};
