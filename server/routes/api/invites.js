const express = require('express');
const HttpStatus = require('http-status-codes');
const _ = require('lodash');

const helpers = require('../helpers');
const models = require('../../models');
const middleware = require('../../auth/middleware');

const router = express.Router();

router.get('/', middleware.isAdminUser, async (req, res) => {
  const { organizationId, page = '1' } = req.query;
  const options = {
    page,
    order: [['createdAt', 'DESC']],
    where: {
      acceptedAt: null,
      revokedAt: null,
    },
  };
  if (organizationId) {
    options.where.OrganizationId = organizationId;
  } else if (!req.user.isSuperUser) {
    res.status(HttpStatus.FORBIDDEN).end();
    return;
  }
  const { records, pages, total } = await models.Invite.paginate(options);
  helpers.setPaginationHeaders(req, res, options.page, pages, total);
  res.json(records.map((record) => record.toJSON()));
});

router.post(
  '/',
  middleware.isAdminUser,
  helpers.wrapper(async (req, res) => {
    const invite = models.Invite.build(
      _.pick(req.body, ['OrganizationId', 'firstName', 'lastName', 'email', 'message', 'isOperationalUser', 'isAdminUser', 'isSuperUser'])
    );
    invite.CreatedById = req.user.id;
    invite.UpdatedById = req.user.id;
    await models.sequelize.transaction(async (transaction) => {
      await invite.save({ transaction });
      await Promise.all(
        req.body.HospitalInvites?.map(async (hi) => {
          const hospital = await models.Hospital.findOne(
            {
              where: {
                id: hi.HospitalId,
                OrganizationId: invite.OrganizationId,
              },
            },
            { transaction }
          );
          if (!hospital) {
            return null;
          }
          return models.HospitalInvite.create(
            {
              InviteId: invite.id,
              CreatedById: req.user.id,
              UpdatedById: req.user.id,
              ..._.pick(hi, ['HospitalId', 'isActive', 'isInfoUser', 'isRingdownUser']),
            },
            { transaction }
          );
        }).filter(Boolean) ?? []
      );
    });
    await invite.sendInviteEmail();
    res.status(HttpStatus.CREATED).json(invite.toJSON());
  })
);

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

router.post(
  '/:id/accept',
  helpers.wrapper(async (req, res, next) => {
    req.logout();
    let user;
    await models.sequelize.transaction(async (transaction) => {
      const invite = await models.Invite.findByPk(req.params.id, {
        include: [models.HospitalInvite],
        transaction,
      });
      if (invite) {
        if (invite.acceptedAt || invite.revokedAt) {
          res.status(HttpStatus.FORBIDDEN).end();
          return;
        }
        user = models.User.build(_.pick(req.body, ['firstName', 'lastName', 'email', 'password']));
        user.OrganizationId = invite.OrganizationId;
        user.isOperationalUser = invite.isOperationalUser;
        user.isAdminUser = invite.isAdminUser;
        user.isSuperUser = invite.isSuperUser;
        user.CreatedById = invite.CreatedById;
        user.UpdatedById = invite.CreatedById;
        await user.save({ transaction });
        await Promise.all(
          invite.HospitalInvites.map((hi) =>
            models.HospitalUser.create(
              {
                EdAdminUserId: user.id,
                HospitalId: hi.HospitalId,
                isActive: hi.isActive,
                isInfoUser: hi.isInfoUser,
                isRingdownUser: hi.isRingdownUser,
                CreatedById: invite.CreatedById,
                UpdatedById: invite.CreatedById,
              },
              { transaction }
            )
          )
        );
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
  })
);

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
