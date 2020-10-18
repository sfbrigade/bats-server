const express = require('express');
const HttpStatus = require('http-status-codes');

const models = require('../../models');

const router = express.Router();

class Ringdown {
  constructor(ambulance, emsCall, hospital, patient, patientDelivery) {
    this.ambulance = ambulance;
    this.emsCall = emsCall;
    this.hospital = hospital;
    this.patient = patient;
    this.patientDelivery = patientDelivery;
  }
}

router.post('/', async (req, res) => {
  // TODO - use a transaction
  try {
    const emsCall = await models.EmergencyMedicalServiceCall.create({
      dispatchCallNumber: req.body.emsCall.dispatchCallNumber,
      startDateTime: '2004-10-19 10:23:54+02', // TODO - pull in a datetime lib
      CreatedById: req.user.id,
      UpdatedById: req.user.id,
    });
    const patient = await models.Patient.create({
      ...req.body.patient,
      EmergencyMedicalServiceCallId: emsCall.id,
      CreatedById: req.user.id,
      UpdatedById: req.user.id,
    });
    const ambulance = await models.Ambulance.findOne({
      where: {
        ambulanceIdentifier: req.body.ambulance.ambulanceIdentifer,
      },
    });
    const hospital = await models.Hospital.findByPk(req.body.hospital.id);
    const patientDelivery = await models.PatientDelivery.create({
      AmbulanceId: ambulance.id,
      PatientId: patient.id,
      HospitalId: hospital.id,
      ParamedicUserId: req.user.id,
      deliveryStatus: 'enroute', // TODO - make an enum?
      departureDateTime: '2004-10-19 10:23:54+02', // TODO - pull in a datetime lib
      CreatedById: req.user.id,
      UpdatedById: req.user.id,
    });

    const ringdown = new Ringdown(ambulance, emsCall, hospital, patient, patientDelivery);
    res.status(HttpStatus.CREATED).json(ringdown);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  }
});

module.exports = router;
