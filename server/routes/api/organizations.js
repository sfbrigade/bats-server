const express = require('express');
const HttpStatus = require('http-status-codes');
const _ = require('lodash');

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

router.post(
  '/',
  middleware.isSuperUser,
  wrapper(async (req, res) => {
    const data = {
      ..._.pick(req.body, ['name', 'type', 'state', 'stateUniqueId', 'timeZone', 'isMfaEnabled', 'isActive']),
      CreatedById: req.user.id,
      UpdatedById: req.user.id,
    };
    if (data.type === 'HEALTHCARE' && !data.stateUniqueId) {
      data.stateUniqueId = null;
    }
    const record = await models.Organization.create(data);
    res.status(HttpStatus.CREATED).json(record.toJSON());
  })
);

router.get('/:id', middleware.isAdminUser, async (req, res) => {
  const organization = await models.Organization.findByPk(req.params.id, {
    include: [models.Hospital],
  });
  if (organization) {
    res.json(organization.toJSON());
  } else {
    res.status(HttpStatus.NOT_FOUND).end();
  }
});

router.patch(
  '/:id',
  middleware.isAdminUser,
  wrapper(async (req, res) => {
    let organization;
    await models.sequelize.transaction(async (transaction) => {
      organization = await models.Organization.findByPk(req.params.id, { transaction });
      if (organization) {
        const data = {
          ..._.pick(req.body, ['name', 'type', 'state', 'stateUniqueId', 'timeZone', 'isMfaEnabled', 'isActive']),
          UpdatedById: req.user.id,
        };
        if ((data.type === 'HEALTHCARE' || (!data.type && organization.type === 'HEALTHCARE')) && !data.stateUniqueId) {
          data.stateUniqueId = null;
        }
        await organization.update(data, { transaction });
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
