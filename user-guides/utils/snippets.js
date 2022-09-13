require('dotenv').config();

const fillEMS = [
  ['#username', process.env.EMS_USER],
  ['#password', process.env.EMS_PASS],
];

module.exports = {
  fillEMS,
  loginEMS: [
    [['goto', '/auth/local/login']],
    ...fillEMS,
    ['"Login"', ['click']],
  ],
};
