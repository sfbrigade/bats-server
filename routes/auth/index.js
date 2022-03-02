const express = require('express');

const router = express.Router();

router.use('/local', require('./local'));
router.use('/peak', require('./peak'));
router.use('/saml', require('./saml'));

module.exports = router;
