const _ = require('lodash');
const OAuthServer = require('@node-oauth/express-oauth-server');

const models = require('../models');
const cache = require('./cache');

function getAccessToken(accessToken) {
  return models.Token.findOne({
    where: {
      accessToken,
    },
    include: ['client', 'user'],
  });
}

async function getAuthorizationCode(authorizationCode) {
  const data = cache.get(`oauth_prc_${authorizationCode}`);
  if (data) {
    const client = await models.Client.findByPk(data.ClientId);
    const user = await models.User.findByPk(data.UserId);
    if (client && user) {
      data.expiresAt = new Date(data.expiresAt);
      data.code = authorizationCode;
      data.client = client;
      data.user = user;
      return data;
    }
  }
  return null;
}

async function getClient(clientId, clientSecret) {
  const client = await models.Client.findOne({
    where: {
      clientId,
    },
  });
  if (client && (!clientSecret || client.authenticate(clientSecret))) {
    client.grants = [];
    client.redirectUris = [];
    if (client.UserId) {
      client.grants.push('client_credentials');
    }
    if (client.redirectUri) {
      client.grants.push('authorization_code');
      client.redirectUris.push(client.redirectUri);
    }
    return client;
  }
  return null;
}

async function getUserFromClient(client) {
  return client.getUser();
}

function revokeAuthorizationCode(code) {
  const key = `oauth_prc_${code.authorizationCode}`;
  const data = cache.get(key);
  if (data) {
    return cache.del(key) === 1;
  }
  return false;
}

function saveAuthorizationCode(code, client, user) {
  const data = JSON.parse(JSON.stringify(code));
  data.clientId = client.id;
  data.userId = user.id;
  const now = new Date();
  cache.set(`oauth_prc_${code.authorizationCode}`, data, Math.round((code.expiresAt.getTime() - now.getTime()) / 1000));
  const obj = { ...code };
  obj.client = client;
  obj.user = user;
  return obj;
}

async function saveToken(token, client, user) {
  const data = _.pick(token, ['accessToken', 'accessTokenExpiresAt']);
  data.clientId = client.id;
  data.userId = user.id;
  data.CreatedById = user.id;
  data.UpdatedById = user.id;
  const obj = await models.Token.create(data);
  obj.client = client;
  obj.user = user;
  return obj;
}

const model = {
  getAccessToken,
  getAuthorizationCode,
  getClient,
  getUserFromClient,
  revokeAuthorizationCode,
  saveAuthorizationCode,
  saveToken,
};

const server = new OAuthServer({
  model,
  allowEmptyState: true,
  authenticateHandler: {
    handle(req) {
      console.log('calling handle?', req);
      return req.user;
    },
  },
});

module.exports = {
  model,
  server,
};
