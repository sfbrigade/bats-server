// eslint-disable no-restricted-syntax
// eslint-disable no-await-in-loop
const fs = require('fs/promises');
const { join, parse } = require('path');

const { BuildPath, AppsPath } = require('./constants');
const Playbill = require('./playbill');
const { isJS } = require('./files');

const PlaybillDefaults = {
  browserOptions: {
    timeout: 2000,
  },
  context: {
    baseURL: 'http://localhost:3000',
    viewport: { width: 500, height: 1000 },
//    deviceScaleFactor: 2,
  },
  options: {
    outputDir: BuildPath,
  },
};
const AppPattern = /^(\w+)-/;

(async () => {
  const scriptsPath = AppsPath;

  await fs.rm(BuildPath, { recursive: true, force: true });

  for (const filename of (await fs.readdir(scriptsPath)).filter(isJS)) {
    const { name } = parse(filename);
    const app = name.match(AppPattern)[1];
    // eslint-disable-next-line import/no-dynamic-require,global-require
    const guide = require(join(scriptsPath, filename));

    console.log(name);

    await Playbill.print({
      ...PlaybillDefaults,
      name,
      app,
      ...guide,
    });

    console.log('\n');
  }
})();
