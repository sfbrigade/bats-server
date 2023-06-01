const express = require('express');

const middleware = require('../../auth/middleware');
const models = require('../../models');
const { wrapper } = require('../helpers');

const router = express.Router();

router.get('/', middleware.isSuperUser, async (req, res) => {
  const orgs = await models.Organization.findAll({
    include: [models.Hospital],
    order: [['name', 'ASC']],
  });
  res.json(orgs.map((org) => org.toJSON()));
});

router.patch(
  '/:id',
  middleware.isAdminUser,
  wrapper(async (req, res) => {
    let organization;
    await models.sequelize.transaction(async (transaction) => {
      organization = await models.Organization.findByPk(req.params.id, { transaction });
      if (organization) {
        await organization.update(req.body, { transaction });
      }
    });
    if (organization) {
      res.json(organization.toJSON());
    } else {
      res.status(HttpStatus.NOT_FOUND).end();
    }
  })
);

module.exports = router;
