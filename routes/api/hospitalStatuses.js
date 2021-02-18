const express = require('express');
const HttpStatus = require('http-status-codes');

const middleware = require('../../auth/middleware');
const models = require('../../models');

const router = express.Router();

function createResponse(hsu) {
  const { id, openEdBedCount, openPsychBedCount, divertStatusIndicator, additionalServiceAvailabilityNotes, updateDateTimeLocal } = hsu;
  const response = {
    id,
    hospital: { // TODO - I feel like we should just flatten this
      id: hsu.Hospital.id,
      name: hsu.Hospital.name,
      ambulancesEnroute: hsu.ambulancesEnroute,
      ambulancesOffloading: hsu.ambulancesOffloading,
    },
    openEdBedCount,
    openPsychBedCount,
    divertStatusIndicator,
    additionalServiceAvailabilityNotes,
    updateDateTimeLocal,
    edAdminUserId: hsu.EdAdminUserId,
    createdById: hsu.CreatedById,
    updatedById: hsu.UpdatedById,
  };
  return response;
}

router.get('/', middleware.isAuthenticated, async (req, res) => {
  try {
    // TODO
    // - for enroute need something like:
    // -    select id, count(*) from patientdelivery where deliverystatus = 'RINGDOWN SENT' or deliverystatus = 'RINGDOWN RECEIVED' group by id;
    // - for offloading need:
    // -    select id, count(*) from patientdelivery where deliverystatus = 'ARRIVED' group by id;
    // - see if it's possible to do a join on hospitalstatusupdate and just make this 1 big query
    const statusUpdates = await models.HospitalStatusUpdate.scope('latest').findAll({
      include: [models.Hospital],
    });
    statusUpdates.sort((a, b) => a.Hospital.sortSequenceNumber - b.Hospital.sortSequenceNumber);
    const response = statusUpdates.map((statusUpdate) => createResponse(statusUpdate));
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
      divertStatusIndicator: req.body.divertStatusIndicator,
      additionalServiceAvailabilityNotes: req.body.additionalServiceAvailabilityNotes,
      updateDateTimeLocal: new Date(), // TODO - use local timezone
      EdAdminUserId: req.user.id,
      CreatedById: req.user.id,
      UpdatedById: req.user.id,
    });
    statusUpdate.Hospital = await statusUpdate.getHospital();
    const response = createResponse(statusUpdate);
    res.status(HttpStatus.CREATED).json(response);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  }
});

module.exports = router;
