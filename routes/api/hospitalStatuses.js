const express = require('express');
const _ = require('lodash');
const HttpStatus = require('http-status-codes');
const { Op } = require('sequelize');
const { DeliveryStatus } = require('../../constants');

const middleware = require('../../auth/middleware');
const models = require('../../models');

const router = express.Router();

function createResponse(hsu, deliveries) {
  const { id, openEdBedCount, openPsychBedCount, divertStatusIndicator, additionalServiceAvailabilityNotes, updateDateTimeLocal } = hsu;
  const response = {
    id,
    hospital: {
      id: hsu.Hospital.id,
      name: hsu.Hospital.name,
      ambulancesEnRoute: _.get(deliveries, 'enRoute', 0),
      ambulancesOffloading: _.get(deliveries, 'offloading', 0),
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
    // NOTE: processing the ambulances enroute and offloading in memory here because it was easier
    // than figuring it out in Sequelize. We can probably use a raw SQL query if this ever becomes
    // a performance issue.
    const activeDeliveries = await models.PatientDelivery.findAll({
      include: [models.Hospital],
      where: {
        [Op.and]: [
          {
            currentDeliveryStatus: { [Op.ne]: DeliveryStatus.OFFLOADED },
          },
          {
            currentDeliveryStatus: { [Op.ne]: DeliveryStatus.RETURNED_TO_SERVICE },
          },
        ],
      },
    });

    const deliveriesByHospitalId = activeDeliveries.reduce((accumulator, delivery) => {
      const deliveries = {
        enRoute: _.get(accumulator, `${delivery.HospitalId}.enRoute`, 0),
        offloading: _.get(accumulator, `${delivery.HospitalId}.offloading`, 0),
      };

      if (
        delivery.currentDeliveryStatus === DeliveryStatus.RINGDOWN_SENT ||
        delivery.currentDeliveryStatus === DeliveryStatus.RINGDOWN_RECEIVED
      ) {
        deliveries.enRoute += 1;
      } else if (delivery.currentDeliveryStatus === DeliveryStatus.ARRIVED) {
        deliveries.offloading += 1;
      }

      accumulator[delivery.HospitalId] = deliveries;

      return accumulator;
    }, {});

    const statusUpdates = await models.HospitalStatusUpdate.scope('latest').findAll({
      include: [models.Hospital],
    });
    statusUpdates.sort((a, b) => a.Hospital.sortSequenceNumber - b.Hospital.sortSequenceNumber);
    const response = statusUpdates.map((statusUpdate) => createResponse(statusUpdate, deliveriesByHospitalId[statusUpdate.HospitalId]));
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
