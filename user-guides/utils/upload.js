// eslint-disable no-restricted-syntax
// eslint-disable no-await-in-loop

const fs = require('fs/promises');
const { join } = require('path');

const { BuildPath } = require('./constants');
const { isPNG, readJSON } = require('./files');
const GuideEntryManager = require('./guide-entry-manager');

const stringify = (data) => JSON.stringify(data, null, 2);

(async () => {
  const manager = await GuideEntryManager.create();

//  for (const app of await fs.readdir(BuildPath)) {
  for (const guideID of (await fs.readdir(BuildPath)).slice(4)) {
    const guidePath = join(BuildPath, guideID);
    // create a list of full paths to the PNGs in this guide directory
    const screenshots = (await fs.readdir(guidePath))
      .filter(isPNG)
      .map((filename) => join(guidePath, filename));

    console.log(`${guideID}: Creating or updating ${screenshots.length} screenshots.`);

    // create or update all the assets for this guide
    const assets = await manager.createOrUpdateAssets(guideID, screenshots);
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



//const client = contentful.createClient({
//  // This is the access token for this space. Normally you get the token in the Contentful web app
//  accessToken: process.env.CONTENTFUL_PAT
//});

/*
client.getSpace(process.env.CONTENTFUL_SPACE_ID).then((space) => {
  // This API call will request an environment with the specified ID
  space.getEnvironment('master').then((environment) => {
//    console.log(environment.createAssetFromFiles);
//    console.log(JSON.stringify(createFileAssetFields('logging-in', 'logging-in-2'), null, 2));

//    environment.getContentTypes()
//      .then(a => console.log(stringify(a)));

    environment.getEntry('5LXPhz5CgYR7PbeyKQNY7f')
      .then((entry) => {
        entry.fields.name['en-US'] = 'bloop blorp, bitches!';
        return entry.update();
      })
      .then((entry) => console.log(stringify(entry)));

//    environment.getEntries({ content_type: 'bodyText' })
//      .then(({ items }) => console.log(stringify(items[0].sys.id)));

/!*
    environment.createEntry('bodyText', fields({
      name: 'derp1',
      text: node('document', [
        node('paragraph', [
          text('booyah!!!')
        ])
      ])
    }))

//    environment.createEntry('bodyText', fields({
//      name: 'derp1',
//      text: {
//        nodeType: 'document',
//        data: {},
//        content: [
//          {
//            nodeType: 'paragraph',
//            data: {},
//            content: [
//              {
//                nodeType: 'text',
//                data: {},
//                marks: [],
//                value: 'booyah'
//              }
//            ]
//          }
//        ]
//      }
//    }))
      .then(asset => console.log(stringify(asset)))
      .catch(console.error);
*!/

/!*
    environment.createAssetFromFiles(createFileAssetFields('logging-in', 'logging-in-2'))
//    environment.createAssetFromFiles({
//      fields: {
//        title: {
//          'en-US': 'logging-in-2'
//        },
//        file: {
//          'en-US': {
//             contentType: 'image/png',
//             fileName: 'logging-in-2.png',
//             file: createReadStream('user-guides/build/logging-in/logging-in-2.png')
//          },
//        }
//      }
//    })
      .then((asset) => {
        console.log(JSON.stringify(asset, null, 2));
        console.log(asset.processForAllLocales);
        return asset.processForAllLocales();
      })
      .then((asset) => {
        console.log("after processing", JSON.stringify(asset, null, 2));
      })
//      .then((asset) => console.log(JSON.stringify(asset, null, 2)))
      .catch(console.error);
*!/

//    // Now that we have an environment, we can get entries from that space
//    environment.getEntries().then((entries) => {
//      console.log(entries.items)
//    })

    // let's get a content type
//    environment.getContentType('product').then((contentType) => {
//      // and now let's update its name
//      contentType.name = 'New Product'
//      contentType.update().then((updatedContentType) => {
//        console.log('Update was successful')
//      })
//    })
  })
});
*/


/*
(async () => {
  const plainClientAPI = contentful.createClient(
    {
      // This is the access token for this space. Normally you get the token in the Contentful web app
      accessToken: process.env.CONTENTFUL_PAT
    },
    {
      type: 'plain',
      defaults: {
        spaceId: process.env.CONTENTFUL_SPACE_ID,
        environmentId: 'master',
      },
    }
  );

  console.log(plainClientAPI.environment);
//  console.log(plainClientAPI.environment.createAssetFromFiles);

//  const entries = await plainClientAPI.entry.getMany({
//    query: {
//      limit: 20,
//    },
//  });
//
//  console.log(entries.items);
})();
*/


/*
const Playbill = require('./playbill');

const GuidesPath = './user-guides';
const BuildPath = path.join(GuidesPath, 'build');
const JSPattern = /^(.+)\.js$/;
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

const isJS = (filename) => JSPattern.test(filename);

(async () => {
  await fs.rm(BuildPath, { recursive: true, force: true });

  const files = (await fs.readdir(GuidesPath)).filter(isJS);

  // eslint-disable-next-line no-restricted-syntax
  for (const filename of files) {
    const name = filename.match(JSPattern)[1];
    // eslint-disable-next-line import/no-dynamic-require,global-require
    const guide = require(path.join(Gu`idesPath, filename));

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
*/
