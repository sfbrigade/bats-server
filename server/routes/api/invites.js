const express = require('express');
const HttpStatus = require('http-status-codes');
const _ = require('lodash');

const helpers = require('../helpers');
const models = require('../../models');
const middleware = require('../../auth/middleware');

const router = express.Router();

router.get('/', middleware.isAdminUser, async (req, res) => {
  const options = {
    page: req.query.page || '1',
    order: [['createdAt', 'DESC']],
    where: {
      acceptedAt: null,
      revokedAt: null,
    },
  };
  const { records, pages, total } = await models.Invite.paginate(options);
  helpers.setPaginationHeaders(req, res, options.page, pages, total);
  res.json(records.map((record) => record.toJSON()));
});

router.post('/', middleware.isAdminUser, async (req, res) => {
  const invite = models.Invite.build(_.pick(req.body, ['OrganizationId', 'firstName', 'lastName', 'email', 'message']));
  invite.CreatedById = req.user.id;
  invite.UpdatedById = req.user.id;
  try {
    await invite.save();
    await invite.sendInviteEmail();
    res.status(HttpStatus.CREATED).json(invite.toJSON());
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: error.errors,
      });
    } else {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
    }
  }
});

router.post('/:id/resend', middleware.isAdminUser, async (req, res) => {
  await models.sequelize.transaction(async (transaction) => {
    const invite = await models.Invite.findByPk(req.params.id, { transaction });
    if (invite) {
      invite.resentAt = new Date();
      invite.ResentById = req.user.id;
      invite.UpdatedById = req.user.id;
      await invite.save({ transaction });
      await invite.sendInviteEmail();
      res.json(invite.toJSON());
    } else {
      res.status(HttpStatus.NOT_FOUND).end();
    }
  });
});

router.delete('/:id', middleware.isAdminUser, async (req, res) => {
  await models.sequelize.transaction(async (transaction) => {
    const invite = await models.Invite.findByPk(req.params.id, { transaction });
    if (invite) {
      if (invite.acceptedAt) {
        res.status(HttpStatus.FORBIDDEN).end();
        return;
      }
      invite.revokedAt = new Date();
      invite.RevokedById = req.user.id;
      invite.UpdatedById = req.user.id;
      await invite.save({ transaction });
      res.status(HttpStatus.OK).end();
    } else {
      res.status(HttpStatus.NOT_FOUND).end();
    }
  });
});

router.post('/:id/accept', async (req, res, next) => {
  req.logout();
  try {
    let user;
    await models.sequelize.transaction(async (transaction) => {
      const invite = await models.Invite.findByPk(req.params.id, { transaction });
      if (invite) {
        if (invite.acceptedAt || invite.revokedAt) {
          res.status(HttpStatus.FORBIDDEN).end();
          return;
        }
        user = models.User.build(_.pick(req.body, ['firstName', 'lastName', 'username', 'email', 'password', 'confirmPassword']));
        user.OrganizationId = invite.OrganizationId;
        user.CreatedById = '00000000-0000-0000-0000-000000000000';
        user.UpdatedById = '00000000-0000-0000-0000-000000000000';
        await user.save({ transaction });
        await user.update({ CreatedById: user.id, UpdatedById: user.id }, { transaction });
        invite.acceptedAt = new Date();
        invite.AcceptedById = user.id;
        invite.UpdatedById = user.id;
        await invite.save({ transaction });
      }
    });
    if (user) {
      req.login(user, (err) => {
        if (err) {
          next(err);
          return;
        }
        res.status(HttpStatus.CREATED).json(user);
      });
    } else {
      res.status(HttpStatus.NOT_FOUND).end();
    }
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: error.errors || [],
      });
    } else {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
    }
  }
});

router.get('/:id', async (req, res) => {
  req.logout();
  const invite = await models.Invite.findByPk(req.params.id);
  if (invite) {
    res.json(invite.toJSON());
  } else {
    res.status(HttpStatus.NOT_FOUND).end();
  }
});

module.exports = router;
