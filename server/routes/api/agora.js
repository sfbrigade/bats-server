const express = require('express');
const { RtcRole, RtcTokenBuilder } = require('agora-token');

const helpers = require('../helpers');
const middleware = require('../../auth/middleware');

const router = express.Router();

router.get(
  '/token',
  middleware.isAuthenticated,
  helpers.wrapper(async (req, res) => {
    const { channelName } = req.query;
    const token = RtcTokenBuilder.buildTokenWithRtm(
      process.env.REACT_APP_AGORA_APP_ID,
      process.env.AGORA_APP_CERTIFICATE,
      channelName,
      req.user.id,
      RtcRole.PUBLISHER,
      60 /* min */ * 60 /* sec/min */
    );
    res.json({ token });
  })
);

module.exports = router;
