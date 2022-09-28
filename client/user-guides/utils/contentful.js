// get the .env from the root of the project, above the current /client directory
require('dotenv').config({ path: '../.env' });

const { createReadStream } = require('fs');
const path = require('path');
const contentful = require('contentful-management');

const GuidesPath = './user-guides';
const BuildPath = path.resolve(GuidesPath, 'build');


async function getEnvironment(
  props = {})
{
  const {
    accessToken = process.env.CONTENTFUL_PAT,
    spaceID = process.env.CONTENTFUL_SPACE_ID,
    environmentName = 'master'
  } = props;
  const client = await contentful.createClient({ accessToken });
  const space = await client.getSpace(spaceID);

  return space.getEnvironment(environmentName);
}

function fields(
  data)
{
  const entries = Object.entries(data)
    .map(([key, value]) => [key, { 'en-US': value }]);

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
    ...(content
      ? { content }
      : null),
  };
}

function text(
  value,
  marks = [],
  props = { data: {} })
{
  return node('text', null, { value, marks, ...props });
}

module.exports = {
  getEnvironment,
  fields,
  fileAssetFields,
  node,
  text,
};
