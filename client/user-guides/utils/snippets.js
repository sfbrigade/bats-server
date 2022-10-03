// get the .env from the root of the project, above the current /client directory
require('dotenv').config({ path: '../.env' });

if (!process.env.EMS_USER) {
  console.error("=============\nCan't find .env file\n=============\n");
}

const fillEMS = [
  ['#username', process.env.EMS_USER],
  ['#password', process.env.EMS_PASS],
];

const fillHospital = [
  ['#username', process.env.HOSPITAL_USER],
  ['#password', process.env.HOSPITAL_PASS],
];

module.exports = {
  fillEMS,
  fillHospital,
  loginEMS: [
    [['goto', '/auth/local/logout']],
    [['goto', '/auth/local/login']],
    ...fillEMS,
    ['"Login"', ['click']],
  ],
  loginHospital: [
    [['goto', '/auth/local/logout']],
    [['goto', '/auth/local/login']],
    ...fillHospital,
    ['"Login"', ['click']],
  ],
};
