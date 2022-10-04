// eslint-disable no-restricted-syntax
// eslint-disable no-await-in-loop

const fs = require('fs/promises');
const { join } = require('path');

const { BuildPath } = require('./constants');
const { isPNG, readJSON } = require('./files');
const GuideEntryManager = require('./guide-entry-manager');

(async () => {
  const manager = await GuideEntryManager.create();

  for (const guideID of await fs.readdir(BuildPath)) {
//  for (const guideID of (await fs.readdir(BuildPath)).slice(4)) {
    const guidePath = join(BuildPath, guideID);
    // create a list of full paths to the PNGs in this guide directory
    const screenshotPaths = (await fs.readdir(guidePath))
      .filter(isPNG)
      .map((filename) => join(guidePath, filename));

    console.log(`${guideID}: Creating or updating ${screenshotPaths.length} screenshots.`);

    // create or update all the assets for this guide
    const assets = await manager.createOrUpdateAssets(guideID, screenshotPaths);
    const { title, steps = [] } = await readJSON([guidePath, 'metadata.json']);

    if (steps.length) {
      const entry = await manager.getEntry(guideID);

      if (entry) {
        console.log(`${guideID}: User guide entry already exists.`);
      } else {
        console.log(`${guideID}: Creating user guide entry with ${steps.length} steps.`);
        await manager.createEntry(guideID, title, assets, steps);
      }
    }
  }
})();
