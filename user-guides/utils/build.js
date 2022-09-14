const fs = require('fs/promises');
const path = require('path');

const Playbill = require('./playbill');

const GuidesPath = './user-guides';
const BuildPath = path.resolve(GuidesPath, 'build');
const JSPattern = /^(.+)\.js$/;
const PlaybillDefaults = {
  context: {
    baseURL: 'http://localhost:3000',
    viewport: { width: 500, height: 1000 },
  },
  options: {
    outputDir: BuildPath,
  },
};

const isJS = (filename) => JSPattern.test(filename);

(async () => {
  await fs.rm(BuildPath, { recursive: true, force: true });

  const files = (await fs.readdir(GuidesPath)).filter(isJS);

  // eslint-disable-next-line no-restricted-syntax
  for (const filename of files) {
    const name = filename.match(JSPattern)[1];
    // eslint-disable-next-line import/no-dynamic-require,global-require
    const guide = require(path.resolve(GuidesPath, filename));

    console.log(name);

    // eslint-disable-next-line no-await-in-loop
    await Playbill.print({
      ...PlaybillDefaults,
      name,
      ...guide,
    });

    console.log('\n');
  }
})();
