const express = require('express');
const HttpStatus = require('http-status-codes');
const _ = require('lodash');
const { Op } = require('sequelize');

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
    const client = models.Client.build(_.pick(req.body, ['name', 'UserId', 'redirectUri']));
    const { clientSecret } = client.generateClientIdAndSecret();
    client.CreatedById = req.user.id;
    client.UpdatedById = req.user.id;
    await client.save();
    const data = client.toJSON();
    data.clientSecret = clientSecret;
    res.status(HttpStatus.CREATED).json(data);
  })
);

router.get(
  '/:id',
  middleware.isSuperUser,
  helpers.wrapper(async (req, res) => {
    const client = await models.Client.findByPk(req.params.id);
    if (client) {
      res.json(client.toJSON());
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
      client = await models.Client.findByPk(req.params.id, { transaction });
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
        data.UpdatedById = req.user.id;
        await client.update(data, { transaction });
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
