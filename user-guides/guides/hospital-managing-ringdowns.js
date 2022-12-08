const { loginHospital } = require('../src/snippets');

module.exports = {
  title: 'Managing the Ringdowns List',
  seeders: [
    'create-3-confirmed-ringdowns.js'
  ],
  script: [
    ...loginHospital,
    ['"Ringdown"', ['click']],
    // start with the sections collapsed.  click in reverse order so their index won't change, since clicking will change the class name,
    // causing the number of matches to then change.
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

    // change the state of the ringdown to offloaded
    ({ dockerExec }) => dockerExec('node user-guides/seeders/set-ringdown-offloaded.js'),
    [['reload']],
    ['"Ringdown"', ['click']],
    ['header', ['click']],

    ({ screenshot }) => screenshot(
      'After a patient has been offloaded, click Dismiss to remove the ringdown from the list. Note that the ringdown will be automatically removed from the list when transport marks their status as returned to service.'
    ),

    // reset the database and add ringdowns with different statuses so we can screenshot them
    ({ dockerExec }) => dockerExec('node user-guides/seeders/create-canceled-redirected-ringdowns.js'),
    [['reload']],
    ['"Ringdown"', ['click']],
    ['header', ['click']],

    ({ screenshot }) => screenshot({ selector: '.ringdown-card >> nth=0' },
      'If transport decides to cancel their delivery or redirect to a new destination, click Dismiss to remove the ringdown from the list. These ringdowns will not be automatically removed.'
    ),

    ({ screenshot }) => screenshot({ selector: '.ringdown-card >> nth=1' }),
  ]
};
