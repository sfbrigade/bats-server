const express = require('express');
const HttpStatus = require('http-status-codes');

const middleware = require('../../auth/middleware');

const router = express.Router();

router.use(middleware.checkAuthorizationHeader);

router.use('/ambulances', require('./ambulances'));
router.use('/clients', require('./clients'));
router.use('/emscalls', require('./emsCalls'));
router.use('/hospitals', require('./hospitals'));
router.use('/hospitalusers', require('./hospitalUsers'));
router.use('/hospitalstatuses', require('./hospitalStatuses'));
router.use('/invites', require('./invites'));
router.use('/mcis', require('./massCasualtyIncidents'));
router.use('/organizations', require('./organizations'));
router.use('/peak', require('./peak'));
router.use('/ringdowns', require('./ringdowns'));
router.use('/users', require('./users'));

router.get('/health', (req, res) => {
  res.status(HttpStatus.NO_CONTENT).end();
});

module.exports = router;
