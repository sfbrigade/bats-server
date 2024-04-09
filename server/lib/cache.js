const NodeCache = require('node-cache');

const cache = new NodeCache();

function get(key) {
  return cache.get(key);
}

function set(key, val, ttl) {
  cache.set(key, val, ttl);
}

function del(key) {
  return cache.del(key);
}

module.exports = {
  get,
  set,
  del,
};
