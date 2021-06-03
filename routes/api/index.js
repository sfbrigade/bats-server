const express = require('express');
const HttpStatus = require('http-status-codes');
const middleware = require('../../auth/middleware');

const router = express.Router();

router.use('/users', require('./users'));
router.use('/ringdowns', require('./ringdowns'));
router.use('/hospitalstatuses', require('./hospitalStatuses'));

router.get('/ambulance-ids', middleware.isAuthenticated, (req, res) => {
  res.status(HttpStatus.OK).json({ ambulanceIds: ['1234', '5678'] });
});
router.get('/dispatch-call-numbers', middleware.isAuthenticated, (req, res) => {
  const ambulanceId = req.query.ambulanceId;
  res.status(HttpStatus.OK).json({ dispatchCallNumbers: ['8888', '9999'] });
});

router.get('/health', (req, res) => {
  res.status(HttpStatus.NO_CONTENT).end();
});

module.exports = router;
