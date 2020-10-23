const { QueryTypes } = require('sequelize');
const express = require('express');
const HttpStatus = require('http-status-codes');

const models = require('../../models');

const router = express.Router();

function createResponse(hsu) {
  const { id, openEdBedCount, divertStatusIndicator, additionalServiceAvailabilityNotes, updateDatetime } = hsu
  const response = {
    id,
    openEdBedCount,
    divertStatusIndicator,
    additionalServiceAvailabilityNotes,
    updateDatetime,
    hospitalId: hsu.HospitalId,
    edAdminUserId: hsu.EdAdminUserId,
    createdById: hsu.CreatedById,
    updatedById: hsu.UpdatedById,
  }
  return response;
}

function createResponseFromQuery(queryResult) {
  const response = {
    id: queryResult.hospital_uuid,
    hospitalName: queryResult.hospitalname,
    openEdBedCount: queryResult.openedbedcount,
    divertStatusIndicator: queryResult.divertstatusindicator,
    updateDatetime: queryResult.updatedatetime,
  };
  return response;
}

router.get('/', async (req, res) => {
  const mostRecentStatusUpdateByHospital = `
    SELECT DISTINCT
      ON (hsu.hospital_uuid) hsu.hospital_uuid,
      hsu.openedbedcount,
      hsu.divertstatusindicator,
      hsu.updatedatetime, 
      h.hospitalname 
    FROM
      hospitalstatusupdate hsu
      INNER JOIN
          hospital h 
          ON h.hospital_uuid = hsu.hospital_uuid 
    ORDER BY
      hospital_uuid,
      updatedatetime DESC
    ;
  `;
  try {
    const queryResults = await models.sequelize.query(mostRecentStatusUpdateByHospital, { type: QueryTypes.SELECT });
    const response = queryResults.map((result) => createResponseFromQuery(result));
    res.status(HttpStatus.OK).json(response);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  }
});

router.post('/', async (req, res) => {
  try {
    const hsu = await models.HospitalStatusUpdate.create({
      HospitalId: req.body.hospitalId,
      openEdBedCount: req.body.openEdBedCount,
      divertStatusIndicator: req.body.divertStatusIndicator,
      additionalServiceAvailabilityNotes: req.body.additionalServiceAvailabilityNotes,
      updateDatetime: new Date(), // TODO - use local timezone
      EdAdminUserId: req.user.id,
      CreatedById:  req.user.id,
      UpdatedById: req.user.id,
    });
    res.status(HttpStatus.CREATED).json(createResponse(hsu));
  } catch (error) {
    console.log(error)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  }
});

module.exports = router;
