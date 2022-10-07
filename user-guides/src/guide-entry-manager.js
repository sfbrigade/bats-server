const { createReadStream } = require('fs');
const { parse } = require('path');
const { AppIDs } = require('./constants');
const { getEnvironment, fileAssetFields, fields, node, asset, text, getField, setField } = require('./contentful');
const getFileHash = require('./get-file-hash');

const { compare } = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

function getApp(name) {
  const match = name.match(/^([^-]+)/);

  return match ? match[1] : '';
}

function guideItem(textString, assetID) {
  // prettier-ignore
  return node('list-item', [
    asset(assetID),
    node('paragraph', [
      text(textString)
    ])
  ]);
}

function guideDocument(items) {
  // prettier-ignore
  return node('document', [
    node('ordered-list', items)
  ]);
}

function compareAssets(a, b) {
  return compare(getField(a, 'title'), getField(b, 'title'));
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

    items.sort(compareAssets);

    // create an index of the assets by title
    return items.reduce((result, asset) => ({ ...result, [getField(asset, 'title')]: asset }), {});
  }

  async createOrUpdateAssets(guideID, imagePaths) {
    const assets = await this.getAssets(guideID);

    for (const imagePath of imagePaths) {
      const { name } = parse(imagePath);
      const asset = assets[name];
      const localHash = getFileHash(imagePath);
      let newAsset;

      if (asset) {
        const cmsHash = getField(asset, 'description');

        if (cmsHash === localHash) {
          // the local image is the same as what's on the server, so don't do any further processing
          continue;
        }

        // upload a new version of the image asset
        const upload = await this.environment.createUpload({
          file: createReadStream(imagePath),
        });
        const { contentType, fileName } = getField(asset, 'file');

        // store the new hash in the description field of the asset and link the asset to the newly uploaded file
        setField(asset, 'description', localHash);
        setField(asset, 'file', {
          contentType,
          fileName,
          uploadFrom: {
            sys: {
              type: 'Link',
              linkType: 'Upload',
              id: upload.sys.id,
            },
          },
        });

        // we have to await the update.  otherwise, the SDK will think it timed out.
        newAsset = await asset.update();
      } else {
        // upload and create the image asset
        newAsset = await this.environment.createAssetFromFiles(fileAssetFields(imagePath, { description: localHash }));
      }

      // after the image is uploaded, it has to be processed to make the asset available
      assets[name] = await newAsset.processForAllLocales();
    }

    return assets;
  }

  async getEntry(guideID) {
    const {
      items: [entry],
    } = await this.environment.getEntries({ content_type: 'userGuide', 'fields.slug': guideID });

    return entry;
  }

  async createEntry(guideID, title, assetsByName, steps) {
    const assets = Object.values(assetsByName);
    const app = getApp(guideID);
    const body = guideDocument(steps.map((step, i) => guideItem(step, assets[i].sys.id)));
    let guideAsset;

    try {
      guideAsset = await this.environment.createEntry(
        'userGuide',
        fields({
          title,
          slug: guideID,
          app: AppIDs[app],
          body,
        })
      );
    } catch (e) {
      console.error('ERROR on userGuide creation:', e);
    }

    return guideAsset;
  }
};
