// get the .env from the root of the project, above the current /client directory
require('dotenv').config({ path: '../.env' });

if (!process.env.EMS_USER) {
  console.error("=============\nCan't find .env file\n=============\n");
}

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
