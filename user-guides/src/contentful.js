// get the .env from the root of the project, above the current /client directory
require('dotenv').config({ path: '../.env' });

const { createReadStream } = require('fs');
const path = require('path');
const contentful = require('contentful-management');

async function getEnvironment(props = {}) {
  const { accessToken = process.env.CONTENTFUL_PAT, spaceID = process.env.CONTENTFUL_SPACE_ID, environmentName = 'master' } = props;
  const client = await contentful.createClient({ accessToken });
  const space = await client.getSpace(spaceID);

  return space.getEnvironment(environmentName);
}

function getField(entry, field) {
  return entry.fields[field]?.['en-US'];
}

function setField(entry, field, value) {
  (entry.fields[field] || (entry.fields[field] = {}))['en-US'] = value;
}

function fields(data) {
  const entries = Object.entries(data).map(([key, value]) => [key, { 'en-US': value }]);

  return {
    fields: Object.fromEntries(entries),
  };
}

function fileAssetFields(filePath, otherFields) {
  const { base, name, ext } = path.parse(filePath);
  const { title = name, description = '' } = otherFields;

  return fields({
    title,
    description,
    file: {
      contentType: `image/${ext.slice(1)}`,
      fileName: base,
      file: createReadStream(filePath),
    },
  });
}

function node(nodeType, content, props = { data: {} }) {
  return {
    nodeType,
    ...props,
    ...(content ? { content } : null),
  };
}

function text(value, marks = [], props = { data: {} }) {
  return node('text', null, { value, marks, ...props });
}

function asset(id) {
  return node('embedded-asset-block', [], {
    data: {
      target: {
        sys: {
          id,
          linkType: 'Asset',
          type: 'Link',
        },
      },
    },
  });
}

module.exports = {
  getEnvironment,
  getField,
  setField,
  fields,
  fileAssetFields,
  node,
  text,
  asset,
};
