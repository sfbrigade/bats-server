const { writeJson, readJson } = require('fs-extra');
const { parse, join } = require('path');

const JSONExtension = '.json';

const createIs = (pattern) => (filename) => pattern.test(filename);

function getJoinedPath(path) {
  let fullPath = path;

  if (Array.isArray(path)) {
    fullPath = join(...path);
  }

  return fullPath;
}

async function readJSON(path) {
  let fullPath = getJoinedPath(path);

  try {
    return await readJson(fullPath);
  } catch (e) {
    return null;
  }
}

function writeJSON(path, data, options = { spaces: 2 }) {
  let fullPath = getJoinedPath(path);

  if (parse(fullPath).ext !== JSONExtension) {
    fullPath += JSONExtension;
  }

  return writeJson(fullPath, data, options);
}

function writeAsset(path, assetInfo) {
  const { name } = parse(assetInfo.fields.file['en-US'].fileName);

  return writeJSON([path, name], assetInfo);
}

async function readAsset(path, name) {
  try {
    return await readJson(join(path, name + '.json'));
  } catch (e) {
    return null;
  }
}

module.exports = {
  readJSON,
  writeJSON,
  readAsset,
  writeAsset,
  isJS: createIs(/^(.+)\.js$/),
  isPNG: createIs(/^(.+)\.png$/),
};
