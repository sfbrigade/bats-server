const express = require('express');
const HttpStatus = require('http-status-codes');
const _ = require('lodash');

const middleware = require('../../auth/middleware');
const models = require('../../models');
const { wrapper } = require('../helpers');

const router = express.Router();

router.get('/', middleware.isAdminUser, async (req, res) => {
  const options = {
    order: [
      ['sortSequenceNumber', 'ASC'],
      ['name', 'ASC'],
    ],
  };
  let { organizationId: OrganizationId } = req.query ?? {};
  if (!req.user.isSuperUser) {
    ({ OrganizationId } = req.user);
  }
  if (OrganizationId) {
    options.where = {
      OrganizationId,
    };
  } else {
    options.include = ['Organization'];
  }
  const records = await models.Hospital.findAll(options);
  res.json(records.map((record) => record.toJSON()));
});

router.post(
  '/',
  middleware.isSuperUser,
  wrapper(async (req, res) => {
    let record;
    await models.sequelize.transaction(async (transaction) => {
      record = await models.Hospital.create(
        {
          ..._.pick(req.body, ['OrganizationId', 'name', 'state', 'stateFacilityCode', 'isActive']),
          CreatedById: req.user.id,
          UpdatedById: req.user.id,
        },
        { transaction }
      );
      // create an initial empty update
      const now = new Date();
      await models.HospitalStatusUpdate.create(
        {
          HospitalId: record.id,
          EdAdminUserId: req.user.id,
          divertStatusIndicator: false,
          divertStatusUpdateDateTimeLocal: now,
          openEdBedCount: 0,
          openPsychBedCount: 0,
          bedCountUpdateDateTimeLocal: now,
          updateDateTimeLocal: now,
          CreatedById: req.user.id,
          UpdatedById: req.user.id,
        },
        { transaction }
      );
    });
    res.status(HttpStatus.CREATED).json(record.toJSON());
  })
);

router.get('/:id', middleware.isAdminUser, async (req, res) => {
  const options = {
    where: { id: req.params.id },
  };
  if (!req.user.isSuperUser) {
    options.where.OrganizationId = req.user.OrganizationId;
  }
  const record = await models.Hospital.findOne(options);
  if (record) {
    res.json(record.toJSON());
  } else {
    res.status(HttpStatus.NOT_FOUND).end();
  }
});

router.patch(
  '/sort',
  middleware.isAdminUser,
  wrapper(async (req, res) => {
    await models.sequelize.transaction(async (transaction) => {
      await Promise.all(
        req.body.map((record) => {
          const { id, sortSequenceNumber } = record;
          return models.Hospital.update({ sortSequenceNumber }, { where: { id }, transaction });
        })
      );
    });
    res.status(HttpStatus.OK).end();
  })
);

router.patch(
  '/:id',
  middleware.isAdminUser,
  wrapper(async (req, res) => {
    const options = {
      where: { id: req.params.id },
    };
    if (!req.user.isSuperUser) {
      options.where.OrganizationId = req.user.OrganizationId;
    }
    let record;
    await models.sequelize.transaction(async (transaction) => {
      record = await models.Hospital.findOne({ ...options, transaction });
      if (record) {
        await record.update(
          {
            ..._.pick(req.body, ['name', 'state', 'stateFacilityCode', 'isActive']),
            UpdatedById: req.user.id,
          },
          { transaction }
        );
      }
    });
    if (record) {
      res.json(record.toJSON());
    } else {
      res.status(HttpStatus.NOT_FOUND).end();
    }
  })
);

module.exports = router;
