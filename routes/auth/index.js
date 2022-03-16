const express = require('express');

const router = express.Router();

router.use('/local', require('./local'));
router.use('/peak', require('./peak'));

module.exports = router;
