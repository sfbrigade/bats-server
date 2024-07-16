const express = require('express');
const HttpStatus = require('http-status-codes');
const _ = require('lodash');

const middleware = require('../../auth/middleware');
const models = require('../../models');
const { wrapper } = require('../helpers');

const router = express.Router();

router.get('/', middleware.isAdminUser, async (req, res) => {
  const options = {
    include: [{ model: models.Hospital }, { model: models.User, as: 'EdAdminUser' }],
  };
  let { userId: EdAdminUserId, hospitalId: HospitalId } = req.query ?? {};
  if (!EdAdminUserId && !HospitalId) {
    res.sendStatus(HttpStatus.BAD_REQUEST).end();
    return;
  }
  let OrganizationId;
  if (!req.user.isSuperUser) {
    ({ OrganizationId } = req.user);
  }
  if (EdAdminUserId) {
    options.where = { EdAdminUserId };
    options.order = [[models.Hospital, 'name', 'ASC']];
  } else if (HospitalId) {
    options.where = { HospitalId };
    options.order = [
      ['EdAdminUser', 'lastName', 'ASC'],
      ['EdAdminUser', 'firstName', 'ASC'],
      ['EdAdminUser', 'email', 'ASC'],
    ];
  }
  if (OrganizationId) {
    options.include[0].where = {
      OrganizationId,
    };
    options.include[1].where = {
      OrganizationId,
    };
  }
  const records = await models.HospitalUser.findAll(options);
  res.json(records.map((record) => record.toJSON()));
});

router.post(
  '/',
  middleware.isAdminUser,
  wrapper(async (req, res) => {
    const { hospitalId, userId } = req.body;
    let record;
    await models.sequelize.transaction(async (transaction) => {
      const hospital = await models.Hospital.findByPk(hospitalId, { transaction });
      const user = await models.User.findByPk(userId, { transaction });
      if (!hospital || !user) {
        return;
      } else if (hospital.OrganizationId !== user.OrganizationId) {
        return;
      } else if (!req.user.isSuperUser && hospital.OrganizationId !== req.user.OrganizationId) {
        return;
      }
      record = await models.HospitalUser.create(
        {
          HospitalId: hospitalId,
          EdAdminUserId: userId,
          CreatedById: req.user.id,
          UpdatedById: req.user.id,
        },
        { transaction }
      );
      record.EdAdminuser = user;
      record.Hospital = hospital;
    });
    if (record) {
      res.status(HttpStatus.CREATED).json(record.toJSON());
    } else {
      res.status(HttpStatus.UNPROCESSIBLE_ENTITY).end();
    }
  })
);

router.patch(
  '/:id',
  middleware.isAdminUser,
  wrapper(async (req, res) => {
    const options = {
      include: [{ model: models.Hospital }, { model: models.User, as: 'EdAdminUser' }],
      where: { id: req.params.id },
    };
    if (!req.user.isSuperUser) {
      const { OrganizationId } = req.user;
      options.include[0].where = {
        OrganizationId,
      };
      options.include[1].where = {
        OrganizationId,
      };
    }
    let record;
    await models.sequelize.transaction(async (transaction) => {
      record = await models.HospitalUser.findOne({ ...options, transaction });
      if (record) {
        await record.update(
          {
            ..._.pick(req.body, ['isActive', 'isInfoUser', 'isRingdownUser']),
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
