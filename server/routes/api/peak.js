const axios = require('axios');
const express = require('express');
const HttpStatus = require('http-status-codes');
const refresh = require('passport-oauth2-refresh');

const middleware = require('../../auth/middleware');
const rollbar = require('../../lib/rollbar');

const { wrapper } = require('../helpers');

const router = express.Router();

const { PR_BASE_URL } = process.env;
const instance = axios.create({
  baseURL: PR_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
});

function get(url, subdomain, accessToken) {
  return instance.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'X-API-Level': '3',
      'X-Agency-Subdomain': subdomain,
    },
  });
}

async function getWithRetry(url, req) {
  try {
    const data = await get(url, req.session.peakSubdomain, req.session.peakAccessToken);
    return data;
  } catch (err) {
    if (err.response?.status === HttpStatus.UNAUTHORIZED) {
      // try refreshing access token
      const data = await new Promise((resolve, reject) => {
        refresh.requestNewAccessToken('peak', req.session.peakRefreshToken, async function (newErr, newAccessToken, newRefreshToken) {
          if (newErr) {
            reject(newErr);
          } else {
            req.session.peakAccessToken = newAccessToken;
            req.session.peakRefreshToken = newRefreshToken;
            try {
              const data = await await get(url, req.session.peakSubdomain, newAccessToken);
              resolve(data);
            } catch (intErr) {
              reject(intErr);
            }
          }
        });
      });
      return data;
    } else {
      throw err;
    }
  }
}

async function getEvent(id, req) {
  const response = await getWithRetry(`/api/events/${id}`, req);
  if (response.status === HttpStatus.OK) {
    const { data: payload } = response;
    const data = { ...payload.Event };
    data.venue = { ...payload.Venue };
    data.venue.facilities = [...payload.Facility];
    return data;
  }
  throw new Error(`Unexpected response status: ${response.status}`);
}

router.get(
  '/events/:id',
  middleware.isAuthenticated,
  wrapper(async (req, res) => {
    if (!req.session.peakAccessToken) {
      res.status(HttpStatus.UNAUTHORIZED).end();
      return;
    }
    try {
      const data = await getEvent(req.params.id, req);
      res.json(data);
    } catch (err) {
      rollbar.error(err, req);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
    }
  })
);

async function getEvents(req) {
  const response = await getWithRetry('/api/events', req);
  if (response.status === HttpStatus.OK) {
    const { data: payload } = response;
    return payload.Event;
  }
  return [];
}

router.get(
  '/events',
  middleware.isAuthenticated,
  wrapper(async (req, res) => {
    if (req.session.peakAccessToken) {
      try {
        const data = await getEvents(req);
        res.json(data);
        return;
      } catch (err) {
        rollbar.error(err, req);
      }
    }
    res.json([]);
  })
);

module.exports = router;
