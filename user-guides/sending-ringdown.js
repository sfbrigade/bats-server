const { loginEMS } = require('./utils/snippets');

module.exports = {
  script: [
    ...loginEMS,
    ['"Unit #"', ['click']],

    'screenshot',

    ['li[role="option"]:has-text("SFFD-1")', ['click']],
    ['"Incident #"', ['click']],

    'screenshot',

    ['"Code 2"', ['click']],
    ['"Age (estimated)"', 58],
    ['"Male"', ['click']],
    ['#chiefComplaintDescription', 'Chest pains'],
    ['"Vitals stable"', ['click']],
    ['"Urgency"', ['scrollIntoViewIfNeeded']],

    'screenshot',

    ['text=Blood Pressure', ['scrollIntoViewIfNeeded']],

    'screenshot',

    ['"Clear Form"', ['scrollIntoViewIfNeeded']],

    'screenshot',

    ['"Select Hospital"', ['click']],

    'screenshot',
  ]
};
