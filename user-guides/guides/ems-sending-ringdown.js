const { loginEMS } = require('../src/snippets');

module.exports = {
  title: 'Sending a Ringdown',
  script: [
    ...loginEMS,
    ['"Unit #"', ['click']],

    'screenshot',

    ['li[role="option"]:has-text("SFFD-1")', ['click']],
    ['"Incident #"', ['click']],

    'screenshot',

    [['press', 'body', 'Enter']],
    ['"Code 2"', ['click']],
    ['"Age (estimated)"', 58],
    ['"Male"', ['click']],
    ['#chiefComplaintDescription', 'Chest pain'],
    ['"Vitals stable"', ['click']],
    ({ scrollToTop }) => scrollToTop('text=Patient info'),

    'screenshot',

    ({ scrollToTop }) => scrollToTop('"Vitals"'),

    'screenshot',

    ['"Clear Form"', ['scrollIntoViewIfNeeded']],

    'screenshot',

    ['"Select Hospital"', ['click']],

    'screenshot',
  ]
};
