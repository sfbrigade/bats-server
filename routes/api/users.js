const express = require('express');
const HttpStatus = require('http-status-codes');

const middleware = require('../../auth/middleware');
const models = require('../../models');

const router = express.Router();

router.get('/', middleware.isAdminUser, async (req, res) => {
  const options = {
    include: [{ model: models.HospitalUser }],
  };
  if (!req.user.isSuperUser) {
    const ahus = await req.user.getActiveHospitalUsers();
    if (req.query.hospitalId) {
      if (!ahus.find((ahu) => ahu.HospitalId === req.query.hospitalId)) {
        res.status(HttpStatus.FORBIDDEN).end();
        return;
      }
      options.include[0].where = {
        HospitalId: req.query.hospitalId,
      };
    } else {
      if (ahus.length !== 1) {
        res.status(HttpStatus.FORBIDDEN).end();
        return;
      }
      options.include[0].where = {
        HospitalId: ahus[0].HospitalId,
      };
    }
  }
  const users = await models.User.findAll(options);
  res.json(users.map((u) => u.toJSON()));
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

router.put('/', middleware.isAdminUser, async (req, res) => {
  try {
    await models.User.update(
      {
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        isOperationalUser: req.body.isOperationalUser,
        isAdminUser: req.body.isAdminUser,
        isSuperUser: req.user?.isSuperUser ? req.body.isSuperUser : false,
        CreatedById: req.user.id,
        UpdatedById: req.user.id,
      },
      { where: { id: req.body.id } }
    );
    res.status(HttpStatus.ACCEPTED).end();
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  }
});

router.delete('/remove', middleware.isAdminUser, async (req, res) => {
  try {
    await models.User.destroy({
      where: {
        email: req.query.data,
      },
    });
    res.status(HttpStatus.ACCEPTED).end();
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  }
});

module.exports = router;
