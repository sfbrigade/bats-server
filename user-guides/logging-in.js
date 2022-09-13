const { fillEMS } = require('./utils/snippets');

module.exports = {
  script: [
    [['goto', '/auth/local/login']],
    ['#username', ['click']],

    'screenshot',

    ...fillEMS,

    'screenshot',
  ]
};
