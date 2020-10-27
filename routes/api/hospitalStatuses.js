const express = require('express');
const HttpStatus = require('http-status-codes');

const models = require('../../models');

const router = express.Router();

function createResponse(hsu) {
  const { id, openEdBedCount, openPsychBedCount, divertStatusIndicator, additionalServiceAvailabilityNotes, updateDateTimeLocal } = hsu;
  const response = {
    id,
    hospitalId: hsu.HospitalId,
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

router.get('/', async (req, res) => {
  const mostRecentStatusUpdatesByHospital = `
    SELECT DISTINCT ON (hospital_uuid) *
    FROM
      hospitalstatusupdate 
    ORDER BY
      hospital_uuid,
      updatedatetimelocal DESC
    ;
  `;
  try {
    const statusUpdates = await models.sequelize.query(mostRecentStatusUpdatesByHospital, {
      model: models.HospitalStatusUpdate,
      mapToModel: true,
    });
    const response = statusUpdates.map((statusUpdate) => createResponse(statusUpdate));
    res.status(HttpStatus.OK).json(response);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  }
});

router.post('/', async (req, res) => {
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
    const response = createResponse(statusUpdate);
    res.status(HttpStatus.CREATED).json(response);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  }
});

module.exports = router;
