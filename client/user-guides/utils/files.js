const { writeJson, readJson } = require('fs-extra');
const { parse, resolve } = require('path');
const createIs = (pattern) => (filename) => pattern.test(filename);

function writeAsset(
  path,
	assetInfo)
{
  const { name } = parse(assetInfo.fields.file['en-US'].fileName);

	return writeJson(resolve(path, name + '.json'), assetInfo, { spaces: 2 });
}

async function readAsset(
  path, name)
{
  try {
    return await readJson(resolve(path, name + '.json'));
  } catch (e) {
    return null;
  }
}

module.exports = {
  writeAsset,
  readAsset,
  isJS: createIs(/^(.+)\.js$/),
  isPNG: createIs(/^(.+)\.png$/)
};
