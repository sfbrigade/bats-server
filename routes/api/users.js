const express = require('express');
const HttpStatus = require('http-status-codes');
const _ = require('lodash');

const middleware = require('../../auth/middleware');
const models = require('../../models');
const { getActiveHospitalUsers } = require('../../wss');

const { setPaginationHeaders, wrapper } = require('../helpers');

const router = express.Router();

async function setHospitalId(req, res, next) {
  // if user is not a superuser, only return users for their active hospital
  const ahus = await req.user.getActiveHospitalUsers();
  if (req.query.hospitalId) {
    if (!req.user.isSuperUser && !ahus.find((ahu) => ahu.HospitalId === req.query.hospitalId)) {
      res.status(HttpStatus.FORBIDDEN).end();
      return;
    }
    req.HospitalId = req.query.hospitalId;
  } else if (ahus.length === 1) {
    req.HospitalId = ahus[0].HospitalId;
  } else if (!req.user.isSuperUser) {
    res.status(HttpStatus.FORBIDDEN).end();
    return;
  }
  next();
}

router.get('/', middleware.isAdminUser, setHospitalId, async (req, res) => {
  const page = req.query.page || '1';
  const options = {
    page,
    include: [{ model: models.HospitalUser }],
    order: [
      ['firstName', 'ASC'],
      ['lastName', 'ASC'],
    ],
  };
  if (req.HospitalId) {
    options.include[0].where = {
      HospitalId: req.HospitalId,
    };
  }
  const { records, pages, total } = await models.User.paginate(options);
  setPaginationHeaders(req, res, page, pages, total);
  res.json(records.map((u) => u.toJSON()));
});

router.post(
  '/',
  middleware.isAdminUser,
  setHospitalId,
  wrapper(async (req, res) => {
    let user;
    await models.sequelize.transaction(async (transaction) => {
      user = await models.User.create(
        {
          ..._.pick(req.body, ['email', 'password', 'firstName', 'lastName', 'isAdminUser', 'isOperationalUser']),
          OrganizationId: req.user.OrganizationId,
          isSuperUser: req.user?.isSuperUser ? req.body.isSuperUser : false,
          CreatedById: req.user.id,
          UpdatedById: req.user.id,
        },
        { transaction }
      );
      if (req.HospitalId) {
        await models.HospitalUser.create(
          {
            ..._.pick(req.body, ['isInfoUser', 'isRingdownUser']),
            HospitalId: req.HospitalId,
            EdAdminUserId: user.id,
            CreatedById: req.user.id,
            UpdatedById: req.user.id,
          },
          { transaction }
        );
      }
    });
    res.status(HttpStatus.CREATED).json(user.toJSON());
  })
);

router.get('/me', middleware.isAuthenticated, async (req, res) => {
  const org = await req.user.getOrganization();
  req.user.Organization = org;
  if (org.type === 'HEALTHCARE') {
    req.user.ActiveHospitalUsers = await req.user.getActiveHospitalUsers({
      include: [models.Hospital],
    });
  }
  res.json(req.user.toJSON());
});

router.get('/active', middleware.isAuthenticated, setHospitalId, async (req, res) => {
  if (req.HospitalId) {
    const userIds = getActiveHospitalUsers(req.HospitalId);
    const users = await models.User.findAll({
      where: { id: userIds },
    });
    res.json(users.map((u) => u.toJSON()));
  } else {
    res.status(HttpStatus.UNPROCESSABLE_ENTITY).end();
  }
});

router.get('/:id', middleware.isAdminUser, setHospitalId, async (req, res) => {
  try {
    const options = {};
    if (req.HospitalId) {
      options.include = [
        {
          model: models.HospitalUser,
          as: 'ActiveHospitalUsers',
          where: {
            HospitalId: req.HospitalId,
          },
        },
      ];
    }
    const user = await models.User.findByPk(req.params.id, options);
    if (user) {
      res.json(user.toJSON());
    } else {
      res.status(HttpStatus.NOT_FOUND).end();
    }
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  }
});

router.patch(
  '/:id',
  middleware.isAdminUser,
  setHospitalId,
  wrapper(async (req, res) => {
    let user;
    await models.sequelize.transaction(async (transaction) => {
      const options = { transaction };
      if (req.HospitalId) {
        options.include = [
          {
            model: models.HospitalUser,
            as: 'ActiveHospitalUsers',
            where: {
              HospitalId: req.HospitalId,
            },
          },
        ];
      }
      user = await models.User.findByPk(req.params.id, options);
      if (user) {
        await user.update(_.pick(req.body, ['firstName', 'lastName', 'email', 'password', 'isAdminUser', 'isOperationalUser']), {
          transaction,
        });
        if (req.HospitalId) {
          const hospitalUser = user.ActiveHospitalUsers.find((ahu) => ahu.HospitalId === req.HospitalId);
          await hospitalUser?.update(_.pick(req.body, ['isActive', 'isInfoUser', 'isRingdownUser']), { transaction });
        }
      }
    });
    if (user) {
      res.json(user.toJSON());
    } else {
      res.status(HttpStatus.NOT_FOUND).end();
    }
  })
);

router.delete('/:id', middleware.isAdminUser, async (req, res) => {
  try {
    let user;
    await models.sequelize.transaction(async (transaction) => {
      user = await models.User.findByPk(req.params.id, { transaction });
      if (user) {
        await user.destroy();
      }
    });
    if (user) {
      res.status(HttpStatus.OK).end();
    } else {
      res.status(HttpStatus.NOT_FOUND).end();
    }
  } catch {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  }
});

module.exports = router;
