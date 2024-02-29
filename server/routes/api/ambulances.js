const express = require('express');
const HttpStatus = require('http-status-codes');

const middleware = require('../../auth/middleware');
const { Ambulance, Organization } = require('../../models');
const rollbar = require('../../lib/rollbar');

const router = express.Router();

router.get('/identifiers', middleware.isAuthenticated, async (req, res) => {
  try {
    const orgId = req.query.organizationId;
    const orgFilter = orgId ? { organization_uuid: orgId } : {};
    const ambulances = await Ambulance.findAll({
      include: [
        {
          model: Organization,
          where: orgFilter,
        },
      ],
      order: [['ambulanceIdentifier', 'ASC']],
    });
    const ambulanceIdentifiers = ambulances.map((ambulance) => ambulance.ambulanceIdentifier);
    res.status(HttpStatus.OK).json({ ambulanceIdentifiers });
  } catch (error) {
    rollbar.error(error, req);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  }
});

module.exports = router;
