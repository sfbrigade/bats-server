const { resolve, join } = require('path');

const RootPath = resolve('.');

module.exports = {
  RootPath,
  BuildPath: join(RootPath, 'build'),
  GuidesPath: join(RootPath, 'guides'),
  AppIDs: {
    ems: 'EMS',
    hospital: 'Hospital',
  },
};
