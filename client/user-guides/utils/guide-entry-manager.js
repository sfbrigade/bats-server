const { createReadStream } = require('fs');
const { parse } = require('path');
const { AppIDs } = require('./constants');
const { getEnvironment, fileAssetFields, fields, node, asset, text } = require('./contentful');

function getApp(
	name)
{
	const match = name.match(/^([^-]+)/);

  return match ? match[1] : '';
}

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

function getField(entry, field) {
  return entry.fields[field]['en-US'];
}

function setField(entry, field, value) {
  entry.fields[field]['en-US'] = value;
}

function compareAssets(a, b) {
	const titleA = getField(a, 'title');
	const titleB = getField(b, 'title');

  if (titleA < titleB) {
    return -1;
  } else if (titleA > titleB) {
    return 1;
  } else {
    return 0;
  }
}

module.exports = class GuideEntryManager {
  static async create() {
    const environment = await getEnvironment();

    return new GuideEntryManager(environment);
  }

  constructor(environment) {
    this.environment = environment;
  }

  async getAssets(guideID) {
    const { items } = await this.environment.getAssets({ 'fields.title[match]': guideID });

// TODO: do a natural sort on the numbers at the end of the filenames
    items.sort(compareAssets);

    return items.reduce((result, asset) => ({ ...result, [getField(asset, 'title')]: asset }), {});
  }

  async createOrUpdateAssets(guideID, imagePaths) {
    const assets = await this.getAssets(guideID);

    for (const imagePath of imagePaths) {
      const { name } = parse(imagePath);
      const asset = assets[name];
      let newAsset;

      if (asset) {
        // upload a new version of the image asset
        const upload = await this.environment.createUpload({
          file: createReadStream(imagePath),
        });
        const { contentType, fileName } = getField(asset, 'file');

        setField(asset, 'file', {
          contentType,
          fileName,
          uploadFrom: {
            sys: {
              type: 'Link',
              linkType: 'Upload',
              id: upload.sys.id
            }
          }
        });

        // we have to await the update.  otherwise, the SDK will think it timed out.
        newAsset = await asset.update();
      } else {
        // upload and create the image asset
        newAsset = await this.environment.createAssetFromFiles(fileAssetFields(imagePath));
      }

      // after the image is uploaded, it has to be processed to make the asset available
      assets[name] = await newAsset.processForAllLocales();
    }

    return assets;
  }

  async getEntry(guideID) {
    const { items: [entry] } = await this.environment.getEntries({ content_type: 'userGuide', 'fields.slug': guideID });

    return entry;
  }

  async createEntry(guideID, title, assetsByName, steps) {
    const assets = Object.values(assetsByName);
    const app = getApp(guideID);
    const body = guideDocument(steps.map((step, i) => guideItem(step, assets[i].sys.id)));
    let guideAsset;

    try {
      guideAsset = await this.environment.createEntry('userGuide', fields({
        title,
        slug: guideID,
        app: AppIDs[app],
        body
      }));
    } catch (e) {
      console.error('ERROR on userGuide creation:', e);
    }

    return guideAsset;
  }
}
