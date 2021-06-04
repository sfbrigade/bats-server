const express = require('express');
const HttpStatus = require('http-status-codes');

const middleware = require('../../auth/middleware');
const { Ambulance } = require('../../models');

const router = express.Router();

router.get('/identifiers', middleware.isAuthenticated, async (req, res) => {
  try {
    const ambulances = await Ambulance.findAll();
    const ambulanceIds = ambulances.map((ambulance) => ambulance.ambulanceIdentifier);
    res.status(HttpStatus.OK).json({ ambulanceIds });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  }
});

module.exports = router;
