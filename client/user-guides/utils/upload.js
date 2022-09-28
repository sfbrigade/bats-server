// get the .env from the root of the project, above the current /client directory
require('dotenv').config({ path: '../.env' });

const fs = require('fs/promises');
const { createReadStream } = require('fs');
const path = require('path');
//const contentful = require('contentful-management');
const { getEnvironment } = require('./contentful');

const GuidesPath = './user-guides';
const BuildPath = path.resolve(GuidesPath, 'build');

const stringify = (data) => JSON.stringify(data, null, 2);

(async () => {
  const environment = await getEnvironment();
  const entry = await environment.getEntry('5LXPhz5CgYR7PbeyKQNY7f');

  entry.fields.name['en-US'] = 'derp DERP';
  await entry.update();

  console.log(stringify(entry));
})();

/*
function fields(
	data)
{
	const entries = Object.entries(data).map(([key, value]) => [key, { 'en-US': value }]);

  return {
    fields: Object.fromEntries(entries)
  };
}

function fileAssetFields(
	directory,
  filename,
  extension = "png")
{
  const fullFilename = `${filename}.${extension}`;

  return fields({
    title: filename,
    file: {
      contentType: `image/${extension}`,
      fileName: fullFilename,
      file: createReadStream(path.resolve(BuildPath, directory, fullFilename))
    }
  });
}

function node(
	nodeType,
  content,
  props = { data: {} })
{
	return {
    nodeType,
    ...props,
    ...(content ? { content } : null),
  };
}

function text(
	value,
  marks = [],
  props = { data: {} })
{
	return node('text', null, { value, marks, ...props });
}
*/

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
const BuildPath = path.resolve(GuidesPath, 'build');
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
*/
