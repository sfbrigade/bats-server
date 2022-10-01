// eslint-disable no-restricted-syntax
// eslint-disable no-await-in-loop

// get the .env from the root of the project, above the current /client directory
require('dotenv').config({ path: '../.env' });

const fs = require('fs/promises');
const { createReadStream } = require('fs');
const { join, parse } = require('path');

const { BuildPath, AppIDs } = require('./constants');
const { getEnvironment, fileAssetFields, fields, node, asset, text } = require('./contentful');
const { readAsset, writeAsset, isPNG } = require('./files');

const stringify = (data) => JSON.stringify(data, null, 2);

function guideItem(
	textString,
  assetID)
{
  return node('list-item', [
    asset(assetID),
    node('paragraph', [
      text(textString)
    ])
  ]);
}

function guideDocument(
	items)
{
  return node('document', [
    node('ordered-list', items)
  ]);
}

async function getGuideAssets()
{
  const guidePattern = /^((ems|hospital)-[-\w]+)-(\d+)$/;
  const environment = await getEnvironment();
  const assets = (await environment.getAssets())?.items;
  const assetsByTitle = assets.reduce((result, asset) => {
    const title = asset.fields.title['en-US'];

    if (guidePattern.test(title)) {
      result[title] = asset;
    }

    return result;
  }, {});

  return assetsByTitle;
}

(async () => {
  // set up the Contentful Management API and get the master environment in the Routed space
  const environment = await getEnvironment();

//  const guideScripts = await environment.getEntries({ content_type: 'userGuideSteps', fields: { slug: 'sending-ringdown', app: 'EMS' } });
//  const guideScripts = await environment.getEntries({ content_type: 'userGuideSteps' });

//  console.log(stringify(guideScripts));

  const assetsByName = await getGuideAssets();

//  console.log(stringify(assetsByName));

//return;

//  for (const app of await fs.readdir(BuildPath)) {
  for (const guide of (await fs.readdir(BuildPath)).slice(0, 1)) {
//  for (const guide of await fs.readdir(BuildPath)) {
//    for (const guide of (await fs.readdir(join(BuildPath, app))).slice(0, 1)) {
//    for (const guide of await fs.readdir(join(BuildPath, app))) {
      const guidePath = join(BuildPath, guide);
//      const guidePath = join(BuildPath, app, guide);
      const screenshots = (await fs.readdir(guidePath)).filter(isPNG);
      const assets = [];

      for (const screenshot of screenshots) {
        const { name } = parse(screenshot);
//        const title = `${app}-${name}`;
        let assetInfo = assetsByName[name];
//        let assetInfo = await readAsset(guidePath, name);

        if (assetInfo) {
console.log("upload", name);
          const upload = await environment.createUpload({
            file: createReadStream(join(guidePath, screenshot)),
          });
          const { contentType, fileName } = assetInfo.fields.file['en-US'];

console.log(upload);
console.log(assetInfo.fields.file['en-US']);

          assetInfo.fields.file['en-US'] = {
            contentType,
            fileName,
            uploadFrom: {
              sys: {
                type: "Link",
                linkType: "Upload",
                id: upload.sys.id
              }
            }
          };
console.log("AFTER", assetInfo.fields.file['en-US']);

          // we have to await the update.  otherwise, the SDK will think it timed out.
          assetInfo = await assetInfo.update();

console.log("AFTER update", assetInfo);
        } else {
          // upload and create the image asset
          assetInfo = await environment.createAssetFromFiles(fileAssetFields(join(guidePath, screenshot), name));
//          const asset = await environment.createAssetFromFiles(fileAssetFields(join(guidePath, screenshot), title));
        }

        // after the image is uploaded, it has to be processed to make the asset available
        assetInfo = await assetInfo.processForAllLocales();
console.log(assetInfo);
        console.log(guide, screenshot);

        assetsByName[name] = assetInfo;
        await writeAsset(guidePath, assetInfo);

        assets.push(assetInfo);
      }

//      console.log(stringify(assets));
//
//      const guideText = guideDocument([
//        guideItem('Navigate to https://sf.routedapp.net.', assets[0].sys.id),
//        guideItem('Enter your Email address and Password and press enter or click Login.', assets[1].sys.id),
//      ]);
//
//      try {
//        const guideAsset = await environment.createEntry('userGuide', fields({
//          title: 'Logging In',
//          slug: guide,
//          app: AppIDs[app],
//          body: guideText
//        }));
//
//        console.log(stringify(guideAsset));
//      } catch (e) {
//        console.error("ERROR", e);
//      }
//    }
  }

  console.log(stringify(assetsByName));

/*
  const environment = await getEnvironment();
  const entry = await environment.getEntry('5LXPhz5CgYR7PbeyKQNY7f');

  entry.fields.name['en-US'] = 'derp DERP';
  await entry.update();

  console.log(stringify(entry));
*/
})();


//console.log(stringify(
//  fields(
//    {
//      name: 'derp1',
//      text: node('document', [
//        node('paragraph', [
//          text('booyah!!!')
//        ])
//      ])
//    }
//  )
//));

//return;

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
