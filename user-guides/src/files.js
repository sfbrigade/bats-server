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

module.exports = {
  readJSON,
  writeJSON,
  isJS: createIs(/^(.+)\.js$/),
  isPNG: createIs(/^(.+)\.png$/),
};
