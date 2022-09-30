const express = require('express');

const router = express.Router();

router.use('/api', require('./api'));
router.use('/auth', require('./auth'));
router.use('/webhooks', require('./webhooks'));

module.exports = router;
