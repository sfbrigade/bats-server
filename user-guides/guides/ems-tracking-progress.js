const { loginEMS } = require('../src/snippets');

module.exports = {
  title: 'Tracking Progress',
  script: [
    ...loginEMS,
    ['"Unit #"', ['click']],
    ['li[role="option"]:has-text("SFFD-1")', ['click']],
    ['"Incident #"', ['click']],
    [['press', 'body', 'Enter']],
    ['"Code 2"', ['click']],
    ['"Age (estimated)"', 58],
    ['"Male"', ['click']],
    ['#chiefComplaintDescription', 'Chest pain'],
    ['"Vitals stable"', ['click']],
    ['"Select Hospital"', ['click']],
    ['label:has-text("SF General")', ['click']],
    ['"ETA"', 12],
    ['text=Send ringdown', ['click']],
    ['text=Redirect patient', ['click']],

    'screenshot',

    ['text=Keep destination', ['click']],
    ['text=Cancel delivery', ['click']],

    'screenshot',

    ['text=No, don\'t cancel', ['click']],

    'screenshot',

    ['text=Mark arrived', ['click']],

    'screenshot',

    ['text=Mark offloaded', ['click']],

    'screenshot',
  ]
};
