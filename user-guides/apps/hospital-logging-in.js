const { fillHospital } = require('../utils/snippets');

module.exports = {
  title: 'Logging In',
  script: [
    [['goto', '/auth/local/logout']],
    [['goto', '/auth/local/login']],
    ['#username', ['click']],

    ({ screenshot }) => screenshot(
      'Navigate to https://sf.routedapp.net in your browser.'
    ),

    ...fillHospital,

    ({ screenshot }) => screenshot(
      'Enter your Email address and Password and press enter or click Login.'
    ),
  ]
};
