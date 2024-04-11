const express = require('express');
const HttpStatus = require('http-status-codes');
const _ = require('lodash');
const { Op, ValidationError, ValidationErrorItem } = require('sequelize');

const middleware = require('../../auth/middleware');
const models = require('../../models');
const helpers = require('../helpers');

const router = express.Router();

router.get(
  '/',
  middleware.isSuperUser,
  helpers.wrapper(async (req, res) => {
    const page = req.query.page || '1';
    const options = {
      page,
      order: [['name', 'ASC']],
      include: models.User,
    };
    const conditions = [];
    if (req.query.search && req.query.search !== '') {
      conditions.push({ name: { [Op.iLike]: `%${req.query.search.trim()}%` } });
    }
    if (conditions.length > 0) {
      options.where = {
        [Op.and]: conditions,
      };
    }
    const { records, pages, total } = await models.Client.paginate(options);
    helpers.setPaginationHeaders(req, res, page, pages, total);
    res.json(records.map((r) => r.toJSON()));
  })
);

router.post(
  '/',
  middleware.isSuperUser,
  helpers.wrapper(async (req, res) => {
    const body = _.pick(req.body, ['name', 'UserId', 'redirectUri']);
    const { UserEmail: email } = req.body;
    if (email) {
      const user = await models.User.findOne({ where: { email } });
      if (user) {
        body.UserId = user.id;
      } else {
        throw new ValidationError('Invalid', [
          new ValidationErrorItem('This email is not registered to a user in Routed', 'FUNCTION', 'UserEmail', email),
        ]);
      }
    }
    const client = models.Client.build(body);
    const { clientSecret } = client.generateClientIdAndSecret();
    client.CreatedById = req.user.id;
    client.UpdatedById = req.user.id;
    await client.save();
    client.User = await client.getUser();
    const data = client.toJSON();
    data.clientSecret = clientSecret;
    res.status(HttpStatus.CREATED).json(data);
  })
);

router.get(
  '/:id',
  middleware.isSuperUser,
  helpers.wrapper(async (req, res) => {
    const client = await models.Client.findByPk(req.params.id, {
      include: models.User,
    });
    if (client) {
      const data = client.toJSON();
      res.json(data);
    } else {
      res.status(HttpStatus.NOT_FOUND).end();
    }
  })
);

router.delete(
  '/:id',
  middleware.isSuperUser,
  helpers.wrapper(async (req, res) => {
    let client;
    await models.sequelize.transaction(async (transaction) => {
      client = await models.Client.findByPk(req.params.id, { transaction });
      if (client) {
        await client.destroy({ transaction });
      }
    });
    if (client) {
      res.status(HttpStatus.OK).end();
    } else {
      res.status(HttpStatus.NOT_FOUND).end();
    }
  })
);

router.patch(
  '/:id/regenerate',
  middleware.isSuperUser,
  helpers.wrapper(async (req, res) => {
    let client;
    let clientSecret;
    await models.sequelize.transaction(async (transaction) => {
      client = await models.Client.findByPk(req.params.id, {
        include: models.User,
        transaction,
      });
      if (client) {
        ({ clientSecret } = client.generateClientIdAndSecret());
        client.UpdatedById = req.user.id;
        await client.save({ transaction });
      }
    });
    if (client) {
      const data = client.toJSON();
      data.clientSecret = clientSecret;
      res.json(data);
    } else {
      res.status(HttpStatus.NOT_FOUND).end();
    }
  })
);

router.patch(
  '/:id',
  middleware.isSuperUser,
  helpers.wrapper(async (req, res) => {
    let client;
    await models.sequelize.transaction(async (transaction) => {
      client = await models.Client.findByPk(req.params.id, { transaction });
      if (client) {
        const data = _.pick(req.body, ['name', 'UserId', 'redirectUri']);
        const { UserEmail: email } = req.body;
        if (email) {
          const user = await models.User.findOne({ where: { email } });
          if (user) {
            data.UserId = user.id;
          } else {
            throw new ValidationError('Invalid', [
              new ValidationErrorItem('This email is not registered to a user in Routed', 'FUNCTION', 'UserEmail', email),
            ]);
          }
        }
        data.UpdatedById = req.user.id;
        await client.update(data, { transaction });
        client.User = await client.getUser({ transaction });
      }
    });
    if (client) {
      res.json(client.toJSON());
    } else {
      res.status(HttpStatus.NOT_FOUND).end();
    }
  })
);

module.exports = router;
