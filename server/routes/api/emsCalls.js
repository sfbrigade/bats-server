const express = require('express');
const HttpStatus = require('http-status-codes');

const middleware = require('../../auth/middleware');
const { Ambulance, EmergencyMedicalServiceCall, EmergencyMedicalServiceCallAmbulance } = require('../../models');
const rollbar = require('../../lib/rollbar');

const router = express.Router();

router.get('/dispatch-call-numbers', middleware.isAuthenticated, async (req, res) => {
  try {
    const { ambulanceIdentifier } = req.query;
    const ambulanceFilter = ambulanceIdentifier ? { ambulanceidentifier: ambulanceIdentifier } : {};
    const emsAmbulances = await EmergencyMedicalServiceCallAmbulance.findAll({
      include: [
        {
          model: Ambulance,
          where: ambulanceFilter,
        },
        {
          model: EmergencyMedicalServiceCall,
        },
      ],
      order: [['EmergencyMedicalServiceCall', 'dispatchCallNumber', 'DESC']],
    });
    const dispatchCallNumbers = emsAmbulances.map((emsAmbulance) => emsAmbulance.EmergencyMedicalServiceCall.dispatchCallNumber);
    res.status(HttpStatus.OK).json({ dispatchCallNumbers });
  } catch (error) {
    rollbar.error(error, req);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  }
});

module.exports = router;
