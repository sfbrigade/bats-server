// eslint-disable no-restricted-syntax
// eslint-disable no-await-in-loop
const fs = require('fs/promises');
const { join, parse } = require('path');

const { BuildPath, GuidesPath } = require('./constants');
const Playbill = require('./playbill');

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
  // globby is ESM only now, so we have to use import() in a CJS script
  const { globbySync } = await import('globby');

  const [filesArg = '*.js'] = process.argv.slice(2);
  const files = globbySync(filesArg, { cwd: GuidesPath });

  for (const filename of files) {
    const { name } = parse(filename);
    const app = name.match(AppPattern)[1];
    // eslint-disable-next-line import/no-dynamic-require,global-require
    const guide = require(join(GuidesPath, filename));

    console.log(name);

    // clear the current output directory before generating new screenshots
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
