const express = require('express');

const middleware = require('../../auth/middleware');
const models = require('../../models');

const router = express.Router();

router.get('/', middleware.isSuperUser, async (req, res) => {
  const orgs = await models.Organization.findAll({
    include: [models.Hospital],
    order: [['name', 'ASC']],
  });
  res.json(orgs.map((org) => org.toJSON()));
});

module.exports = router;
