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
//    headless: false,
//    devtools: true,
  },
  context: {
    baseURL: 'http://localhost:3000',
    viewport: { width: 550, height: 1000 },
//    deviceScaleFactor: 2,
  },
  options: {
    outputDir: BuildPath,
  },
};
const AppPattern = /^(\w+)-/;

(async () => {
  const scriptsPath = AppsPath;

  for (const filename of (await fs.readdir(scriptsPath)).filter(isJS)) {
    const { name } = parse(filename);
    const app = name.match(AppPattern)[1];
    // eslint-disable-next-line import/no-dynamic-require,global-require
    const guide = require(join(scriptsPath, filename));

    console.log(name);

    // clear the current output path before generating new screenshots
    await fs.rm(join(BuildPath, name), { recursive: true, force: true });
    await Playbill.print({
      ...PlaybillDefaults,
      name,
      app,
      ...guide,
    });

    console.log('\n');
  }
})();
