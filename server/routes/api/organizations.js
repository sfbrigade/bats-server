const express = require('express');

const middleware = require('../../auth/middleware');
const models = require('../../models');
const organization = require('../../models/organization');

const router = express.Router();

router.get('/', middleware.isSuperUser, async (req, res) => {
  const orgs = await models.Organization.findAll({
    include: [models.Hospital],
    order: [['name', 'ASC']],
  });
  res.json(orgs.map((org) => org.toJSON()));
});

router.patch(
  ':id',
  middleware.isAdminUser,
  wrapper( async (req, res) => {
    await models.sequelize.transaction(async (transaction) => {
      organization = await models.Organization.findByPk(req.params.id);
      if (organization) {
        organization.update({'ismfaenabled': !organization.ismfaenabled}, {transaction})
      }
    });
    if (organization) {
      res.json(organization.toJSON());
    } else {
      res.status(HttpStatus.NOT_FOUND).end();
    }
  }
  )
);

module.exports = router;
