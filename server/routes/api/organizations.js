const express = require('express');
const HttpStatus = require('http-status-codes');
const _ = require('lodash');

const middleware = require('../../auth/middleware');
const models = require('../../models');
const { setPaginationHeaders, wrapper } = require('../helpers');

const router = express.Router();

router.get('/', middleware.isAuthenticated, async (req, res) => {
  const { page = '1', type, include } = req.query;
  const options = {
    page,
    order: [['name', 'ASC']],
  };
  if (type) {
    options.where = { type: type.trim() };
  }
  if (include) {
    options.include = include.split(',').map((i) => ({ model: models[i] }));
  }
  const { records, pages, total } = await models.Organization.paginate(options);
  setPaginationHeaders(req, res, pages, pages, total);
  res.json(records.map((r) => r.toJSON()));
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

router.put(
  '/:id',
  middleware.isC4SFUser,
  wrapper(async (req, res) => {
    let organization,
      isCreated = false;
    await models.sequelize.transaction(async (transaction) => {
      organization = await models.Organization.findByPk(req.params.id, { transaction });
      const data = {
        ..._.pick(req.body, ['name', 'type', 'state', 'stateUniqueId', 'timeZone', 'isMfaEnabled', 'isActive']),
        UpdatedById: req.user.id,
      };

      if (organization) {
        // Update existing record
        if ((data.type !== 'EMS' || (!data.type && organization.type !== 'EMS')) && data.stateUniqueId !== null) {
          data.stateUniqueId = null;
        }
        await organization.update(data, { transaction });
      } else {
        isCreated = true;
        // Create new record
        data.CreatedById = req.user.id;
        if (data.type !== 'EMS' && data.stateUniqueId) {
          data.stateUniqueId = null;
        }
        organization = await models.Organization.create(
          {
            ...data,
            id: req.params.id,
          },
          { transaction }
        );
      }
    });
    res.status(isCreated ? HttpStatus.CREATED : HttpStatus.OK).json(organization.toJSON());
  })
);

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
        if ((data.type !== 'EMS' || (!data.type && organization.type !== 'EMS')) && data.stateUniqueId !== null) {
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
