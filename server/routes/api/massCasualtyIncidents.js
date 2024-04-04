const express = require('express');
const HttpStatus = require('http-status-codes');
const _ = require('lodash');

const middleware = require('../../auth/middleware');
const models = require('../../models');
const { wrapper } = require('../helpers');

const { dispatchMciUpdate } = require('../../wss');

const router = express.Router();

router.get('/', middleware.isSuperUser, async (req, res) => {
  const records = await models.MassCasualtyIncident.findAll({
    order: [
      ['endedAt', 'DESC'],
      ['startedAt', 'DESC'],
    ],
  });
  res.json(records.map((r) => r.toJSON()));
});

router.post(
  '/',
  middleware.isSuperUser,
  wrapper(async (req, res) => {
    const data = {
      ..._.pick(req.body, [
        'incidentNumber',
        'address1',
        'address2',
        'city',
        'state',
        'zip',
        'startedAt',
        'endedAt',
        'estimatedRedCount',
        'estimatedYellowCount',
        'estimatedGreenCount',
        'estimatedZebraCount',
      ]),
      CreatedById: req.user.id,
      UpdatedById: req.user.id,
    };
    const record = await models.MassCasualtyIncident.create(data);
    if (record) {
      res.status(HttpStatus.CREATED).json(record.toJSON());
      await dispatchMciUpdate(record.id);
    } else {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
    }
  })
);

router.get('/:id', middleware.isSuperUser, async (req, res) => {
  const record = await models.MassCasualtyIncident.findByPk(req.params.id);
  if (record) {
    res.json(record.toJSON());
  } else {
    res.status(HttpStatus.NOT_FOUND).end();
  }
});

router.patch(
  '/:id',
  middleware.isSuperUser,
  wrapper(async (req, res) => {
    let record;
    await models.sequelize.transaction(async (transaction) => {
      record = await models.MassCasualtyIncident.findByPk(req.params.id, { transaction });
      if (record) {
        await record.update(
          _.pick(req.body, [
            'incidentNumber',
            'address1',
            'address2',
            'city',
            'state',
            'zip',
            'startedAt',
            'endedAt',
            'estimatedRedCount',
            'estimatedYellowCount',
            'estimatedGreenCount',
            'estimatedZebraCount',
          ]),
          { transaction }
        );
      }
    });
    if (record) {
      res.json(record.toJSON());
      // check for active MCIs, if all closed, reset MCI counts for all hospitals
      await models.sequelize.transaction(async (transaction) => {
        const mcis = await models.MassCasualtyIncident.scope('active').findAll({ transaction });
        if (mcis.length === 0) {
          const statusUpdates = await models.HospitalStatusUpdate.scope('latest').findAll({
            transaction,
          });
          await Promise.all(
            statusUpdates.map((su) => {
              const data = {
                ..._.pick(su, [
                  'HospitalId',
                  'openEdBedCount',
                  'openPsychBedCount',
                  'bedCountUpdateDateTimeLocal',
                  'divertStatusIncicator',
                  'divertStatusUpdateDateTimeLocal',
                  'additionalServiceAvailabilityNotes',
                  'notesUpdateDateTimeLocal',
                ]),
                mciRedCapacity: null,
                mciYellowCapacity: null,
                mciGreenCapacity: null,
                mciUpdateDateTime: null,
                updateDateTimeLocal: new Date(),
                EdAdminUserId: req.user.id,
                CreatedById: req.user.id,
                UpdatedById: req.user.id,
              };
              return models.HospitalStatusUpdate.create(data, { transaction });
            })
          );
        }
      });
      await dispatchMciUpdate(record.id);
    } else {
      res.status(HttpStatus.NOT_FOUND).end();
    }
  })
);

module.exports = router;
