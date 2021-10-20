const express = require('express');
const HttpStatus = require('http-status-codes');

const middleware = require('../../auth/middleware');
const models = require('../../models');

const router = express.Router();

router.get('/', middleware.isAdminUser, async (req, res) => {
  const users = await models.User.findAll();
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
    console.log(err);
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

router.delete('/remove', middleware.isAdminUser, async (req, res) => {
  console.log("hello", req)
  try{
    await models.User.destroy({
      where: {
        // work in progress body being passed empty
        email: req.query.data,
      }
    })
    res.status(HttpStatus.ACCEPTED).end();
  } catch (err) {
    console.log(err)
    console.log(err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  }
});

module.exports = router;
