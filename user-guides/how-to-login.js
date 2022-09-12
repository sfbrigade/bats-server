const Playbill = require('./utils/playbill');
require('dotenv').config();

(async () => {
  await Playbill.print({
    name: 'how-to-login',
    context: {
      baseURL: 'http://localhost:3000',
      viewport: { width: 500, height: 1000 },
    },
    options: {
      outputDir: './user-guides/build',
    },
    script: [
      [['goto', '/auth/local/login']],
      ['#username', process.env.EMS_USER],
      ['#password', process.env.EMS_PASS],

      'screenshot',

      ['"Login"', ['click']],
      ['"Unit #"', ['click']],
      ['li[role="option"]:has-text("SFFD-1")', ['click']],
      ['"Incident #"', ['click']],
      [['press', 'body', 'Enter']],
      ['"Code 2"', ['click']],

      'screenshot',

      ['"Age (estimated)"', 32],
      ['"Male"', ['click']],
      ['#chiefComplaintDescription', 'Generalized hangriness'],
      ['text=Vitals stable', ['click']],
      ['#systolicBloodPressure', 130],
      ['#diastolicBloodPressure', 90],

      'screenshot',

      ['#oxygenSaturation', 85],
      ['"Combative"', ['click']],
      ['"COVID-19 suspected"', ['click']],
      ['"Clear Form"', ['scrollIntoViewIfNeeded']],

      'screenshot',
    ]
  });
})();
