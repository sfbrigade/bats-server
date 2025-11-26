const express = require('express');
const { RtcRole, RtcTokenBuilder } = require('agora-token');

const helpers = require('../helpers');
const middleware = require('../../auth/middleware');

const router = express.Router();

router.get(
  '/token',
  middleware.isAuthenticated,
  helpers.wrapper(async (req, res) => {
    const { userId, channelName } = req.query;
    if (req.user.id !== userId) {
      // TODO: verify channelName is a valid hospital/facility the user is permitted to represent
    }
    const token = RtcTokenBuilder.buildTokenWithRtm(
      process.env.REACT_APP_AGORA_APP_ID,
      process.env.AGORA_APP_CERTIFICATE,
      channelName,
      userId,
      RtcRole.PUBLISHER,
      60 /* min */ * 60 /* sec/min */
    );
    res.json({ token });
  })
);

module.exports = router;
