const { fillEMS } = require('../src/snippets');

module.exports = {
  title: 'Logging In',
  script: [
    [['goto', '/auth/local/logout']],
    [['goto', '/auth/local/login']],
    ['#username', ['click']],

    'screenshot',

    ...fillEMS,

    'screenshot',
  ],
};
