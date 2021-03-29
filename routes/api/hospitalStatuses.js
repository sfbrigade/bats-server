const express = require('express');
const HttpStatus = require('http-status-codes');

const middleware = require('../../auth/middleware');
const models = require('../../models');
const { dispatchStatusUpdate } = require('../../wss');

const router = express.Router();

router.get('/', middleware.isAuthenticated, async (req, res) => {
  try {
    const statusUpdates = await models.HospitalStatusUpdate.getLatestUpdatesWithAmbulanceCounts();
    const response = await Promise.all(statusUpdates.map((statusUpdate) => statusUpdate.toJSON()));
    res.status(HttpStatus.OK).json(response);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  }
});

router.post('/', middleware.isAuthenticated, async (req, res) => {
  try {
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
  } catch (error) {
    res.status(HttpStatus.FORBIDDEN).end();
  }
  try {
    const statusUpdate = await models.HospitalStatusUpdate.create({
      HospitalId: req.body.hospitalId,
      openEdBedCount: req.body.openEdBedCount,
      openPsychBedCount: req.body.openPsychBedCount,
      bedCountUpdateDateTimeLocal: req.body.bedCountUpdateDateTimeLocal,
      divertStatusIndicator: req.body.divertStatusIndicator,
      divertStatusUpdateDateTimeLocal: req.body.divertStatusUpdateDateTimeLocal,
      additionalServiceAvailabilityNotes: req.body.additionalServiceAvailabilityNotes,
      notesUpdateDateTimeLocal: req.body.notesUpdateDateTimeLocal,
      updateDateTimeLocal: req.body.updateDateTimeLocal,
      EdAdminUserId: req.user.id,
      CreatedById: req.user.id,
      UpdatedById: req.user.id,
    });
    res.status(HttpStatus.CREATED).json(await statusUpdate.toJSON());
    await dispatchStatusUpdate(req.body.hospitalId);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  }
});

module.exports = router;
