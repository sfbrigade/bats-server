const express = require('express');
const HttpStatus = require('http-status-codes');

const middleware = require('../../auth/middleware');
const models = require('../../models');

const router = express.Router();

router.get('/', middleware.isSuperUser, async (req, res) => {
  const users = await models.User.findAll();
  res.json(users.map((u) => u.toJSON()));
});

router.post('/', async (req, res) => {
  try {
    const user = await models.User.create({
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      isSuperUser: req.user?.isSuperUser ? req.body.isSuperUser : false,
    });
    res.status(HttpStatus.CREATED).json(user.toJSON());
  } catch {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  }
});

router.get('/me', middleware.isAuthenticated, async (req, res) => {
  const org = await req.user.getOrganization();
  req.user.Organization = org;
  if (org.type === 'HEALTHCARE') {
    req.user.activeHospitals = await req.user.getActiveHospitals();
  }
  res.json(req.user.toJSON());
});

module.exports = router;
