const express = require('express');

const router = express.Router();

router.use('/local', require('./local'));
router.use('/peak', require('./peak'));
router.use('/oauth2', require('./openId'));

module.exports = router;
