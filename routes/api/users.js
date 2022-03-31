const express = require('express');
const HttpStatus = require('http-status-codes');
const _ = require('lodash');

const middleware = require('../../auth/middleware');
const models = require('../../models');

const { setPaginationHeaders } = require('../helpers');

const router = express.Router();

router.get('/', middleware.isAdminUser, async (req, res) => {
  const page = req.query.page || '1';
  const options = {
    page,
    include: [{ model: models.HospitalUser }],
  };
  // if user is not a superuser, only return users for their active hospital
  const ahus = await req.user.getActiveHospitalUsers();
  if (req.query.hospitalId) {
    if (!req.user.isSuperUser && !ahus.find((ahu) => ahu.HospitalId === req.query.hospitalId)) {
      res.status(HttpStatus.FORBIDDEN).end();
      return;
    }
    options.include[0].where = {
      HospitalId: req.query.hospitalId,
    };
  } else if (ahus.length === 1) {
    options.include[0].where = {
      HospitalId: ahus[0].HospitalId,
    };
  } else if (!req.user.isSuperUser) {
    res.status(HttpStatus.FORBIDDEN).end();
    return;
  }
  const { records, pages, total } = await models.User.paginate(options);
  setPaginationHeaders(req, res, page, pages, total);
  res.json(records.map((u) => u.toJSON()));
});

router.post('/', middleware.isAdminUser, async (req, res) => {
  try {
    const user = await models.User.create({
      OrganizationId: req.user.OrganizationId,
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      isSuperUser: req.user?.isSuperUser ? req.body.isSuperUser : false,
      CreatedById: req.user.id,
      UpdatedById: req.user.id,
    });
    res.status(HttpStatus.CREATED).json(user.toJSON());
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  }
});

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

router.get('/:id', middleware.isAdminUser, async (req, res) => {
  try {
    const user = await models.User.findByPk(req.params.id);
    if (user) {
      // TODO: verify user is in same hospital as calling user
      res.json(user.toJSON());
    } else {
      res.status(HttpStatus.NOT_FOUND).end();
    }
  } catch {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  }
});

router.patch('/:id', middleware.isAdminUser, async (req, res) => {
  try {
    let user;
    await models.sequelize.transaction(async (transaction) => {
      user = await models.User.findByPk(req.params.id, { transaction });
      if (user) {
        // TODO: verify user is in same hospital as calling user
        await user.update(_.pick(req.body, ['firstName', 'lastName', 'email', 'password']), { transaction });
      }
    });
    if (user) {
      res.json(user.toJSON());
    } else {
      res.status(HttpStatus.NOT_FOUND).end();
    }
  } catch {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  }
});

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
