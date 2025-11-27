const express = require('express');
const { RtcRole, RtcTokenBuilder, RtmTokenBuilder } = require('agora-token');

const helpers = require('../helpers');
const middleware = require('../../auth/middleware');

const router = express.Router();

router.get(
  '/rtm-token',
  middleware.isAuthenticated,
  helpers.wrapper(async (req, res) => {
    const token = RtmTokenBuilder.buildToken(
      process.env.REACT_APP_AGORA_APP_ID,
      process.env.AGORA_APP_CERTIFICATE,
      0,
      23 /* hr */ * 60 /* min/hr */ * 60 /* sec/min */
    );
    res.json({ token });
  })
);

router.get(
  '/rtc-token',
  middleware.isAuthenticated,
  helpers.wrapper(async (req, res) => {
    const { channelName } = req.query;
    const token = RtcTokenBuilder.buildTokenWithUserAccount(
      process.env.REACT_APP_AGORA_APP_ID,
      process.env.AGORA_APP_CERTIFICATE,
      channelName,
      0,
      RtcRole.PUBLISHER,
      23 /* hr */ * 60 /* min/hr */ * 60 /* sec/min */
    );
    res.json({ token });
  })
);

module.exports = router;
