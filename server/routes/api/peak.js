const axios = require('axios');
const express = require('express');
const HttpStatus = require('http-status-codes');
const refresh = require('passport-oauth2-refresh');

const middleware = require('../../auth/middleware');
const { wrapper } = require('../helpers');

const router = express.Router();

const { PR_BASE_URL } = process.env;
const instance = axios.create({
  baseURL: PR_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
});

async function getEvent(id, subdomain, accessToken) {
  const response = await instance.get(`/api/events/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'X-API-Level': '3',
      'X-Agency-Subdomain': subdomain,
    },
  });
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
      const data = await getEvent(req.params.id, req.session.peakSubdomain, req.session.peakAccessToken);
      res.json(data);
    } catch (err) {
      if (err.response?.status === HttpStatus.UNAUTHORIZED) {
        // try refreshing access token
        refresh.requestNewAccessToken('peak', req.session.peakRefreshToken, async function (err, accessToken) {
          if (err) {
            console.log(err);
          } else {
            req.session.peakAccessToken = accessToken;
            try {
              const data = await getEvent(req.params.id, req.session.peakSubdomain, accessToken);
              res.json(data);
              return;
            } catch (err) {
              console.log(err);
            }
          }
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
        });
        return;
      } else {
        console.log(err);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
      }
    }
  })
);

async function getEvents(subdomain, accessToken) {
  const response = await instance.get('/api/events', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'X-API-Level': '3',
      'X-Agency-Subdomain': subdomain,
    },
  });
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
        const data = await getEvents(req.session.peakSubdomain, req.session.peakAccessToken);
        res.json(data);
        return;
      } catch (err) {
        if (err.response?.status === HttpStatus.UNAUTHORIZED) {
          // try refreshing access token
          refresh.requestNewAccessToken('peak', req.session.peakRefreshToken, async function (err, accessToken) {
            if (err) {
              console.log(err);
            } else {
              console.log('new access token', accessToken);
              req.session.peakAccessToken = accessToken;
              try {
                const data = await getEvents(req.session.peakSubdomain, accessToken);
                res.json(data);
                return;
              } catch (err) {
                console.log(err);
              }
            }
            res.json([]);
          });
          return;
        } else {
          console.log(err);
        }
      }
    }
    res.json([]);
  })
);

module.exports = router;
