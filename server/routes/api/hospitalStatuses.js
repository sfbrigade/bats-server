const express = require('express');
const HttpStatus = require('http-status-codes');
const _ = require('lodash');

const middleware = require('../../auth/middleware');
const models = require('../../models');
const rollbar = require('../../lib/rollbar');
const { dispatchStatusUpdate } = require('../../wss');

const router = express.Router();

router.get('/', middleware.isAuthenticated, async (req, res) => {
  try {
    const statusUpdates = await models.HospitalStatusUpdate.getLatestUpdatesWithAmbulanceCounts();
    const response = await Promise.all(statusUpdates.map((statusUpdate) => statusUpdate.toJSON()));
    res.status(HttpStatus.OK).json(response);
  } catch (error) {
    rollbar.error(error, req);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  }
});

router.post('/', middleware.isAuthenticated, async (req, res) => {
  try {
    if (!req.user.isSuperUser) {
      // ensure authenticated user is an administrator of this hospital ED
      await models.HospitalUser.findOne({
        where: {
          HospitalId: req.body.hospitalId,
          EdAdminUserId: req.user.id,
        },
        rejectOnEmpty: true,
      });
      // ensure authenticated user is an operational user allowed to do this
      if (!req.user.isOperationalUser) {
        throw new Error();
      }
    }
  } catch (error) {
    res.status(HttpStatus.FORBIDDEN).end();
  }
  try {
    let statusUpdate;
    await models.sequelize.transaction(async (transaction) => {
      statusUpdate = await models.HospitalStatusUpdate.scope('latest').findOne({
        where: {
          HospitalId: req.body.hospitalId,
        },
        transaction,
      });
      let data = {};
      if (statusUpdate) {
        data = _.pick(statusUpdate, [
          'mciRedCapacity',
          'mciYellowCapacity',
          'mciGreenCapacity',
          'mciUpdateDateTime',
          'openEdBedCount',
          'openPsychBedCount',
          'bedCountUpdateDateTimeLocal',
          'divertStatusIncicator',
          'divertStatusUpdateDateTimeLocal',
          'additionalServiceAvailabilityNotes',
          'notesUpdateDateTimeLocal',
          'updateDateTimeLocal',
        ]);
      }
      data = {
        ...data,
        ..._.pick(req.body, [
          'mciRedCapacity',
          'mciYellowCapacity',
          'mciGreenCapacity',
          'mciUpdateDateTime',
          'openEdBedCount',
          'openPsychBedCount',
          'bedCountUpdateDateTimeLocal',
          'divertStatusIncicator',
          'divertStatusUpdateDateTimeLocal',
          'additionalServiceAvailabilityNotes',
          'notesUpdateDateTimeLocal',
          'updateDateTimeLocal',
        ]),
        HospitalId: req.body.hospitalId,
        EdAdminUserId: req.user.id,
        CreatedById: req.user.id,
        UpdatedById: req.user.id,
      };
      statusUpdate = await models.HospitalStatusUpdate.create(data, { transaction });
    });
    res.status(HttpStatus.CREATED).json(await statusUpdate.toJSON());
    await dispatchStatusUpdate(req.body.hospitalId);
  } catch (error) {
    rollbar.error(error, req);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  }
});

module.exports = router;
