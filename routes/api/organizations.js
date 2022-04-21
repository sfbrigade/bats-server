const express = require('express');

const middleware = require('../../auth/middleware');
const models = require('../../models');

const router = express.Router();

// this may not be needed will keep for now
router.get('/', middleware.isAdminUser, async (req, res) => {
  const orgs = await models.Organization.findAll();
  res.json(orgs.map((org) => org.toJSON()));
});

module.exports = router;
