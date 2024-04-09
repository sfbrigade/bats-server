const express = require('express');
const oauth = require('../lib/oauth');

const router = express.Router();

router.use('/authorize', oauth.server.authorize());
router.use('/token', oauth.server.token());

module.exports = router;
