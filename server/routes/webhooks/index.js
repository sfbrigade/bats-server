const express = require('express');

const router = express.Router();

router.use('/sffd', require('./sffd'));

module.exports = router;
