const express = require('express');
const HttpStatus = require('http-status-codes');

const middleware = require('../../auth/middleware');
const { Ambulance, EmergencyMedicalServiceCall, EmergencyMedicalServiceCallAmbulance } = require('../../models');

const router = express.Router();

router.get('/dispatch-call-numbers', middleware.isAuthenticated, async (req, res) => {
  try {
    const queryId = req.query.ambulanceIdentifier;
    const ambulanceIdentifierFilter = queryId ? { ambulanceidentifier: queryId } : {};
    const emsAmbulances = await EmergencyMedicalServiceCallAmbulance.findAll({
      include: [
        {
          model: Ambulance,
          where: ambulanceIdentifierFilter,
        },
        {
          model: EmergencyMedicalServiceCall,
        },
      ],
    });
    const dispatchCallNumbers = emsAmbulances.map((emsAmbulance) => emsAmbulance.EmergencyMedicalServiceCall.dispatchCallNumber);
    res.status(HttpStatus.OK).json({ dispatchCallNumbers });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  }
});

module.exports = router;
