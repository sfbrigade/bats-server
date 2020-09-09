const express = require('express');
const router = express.Router();

router.use('/api', require('./api'));
router.use('/auth', require('./auth'));

module.exports = router;
