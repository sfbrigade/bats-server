const { resolve, join } = require('path');

const GuidesPath = resolve('.');

module.exports = {
  GuidesPath,
  BuildPath: join(GuidesPath, 'build'),
  AppsPath: join(GuidesPath, 'guides'),
  AppIDs: {
    ems: 'EMS',
    hospital: 'Hospital',
  },
};
