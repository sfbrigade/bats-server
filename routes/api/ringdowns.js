
const express = require('express');
const HttpStatus = require('http-status-codes');

const models = require('../../models');

const router = express.Router();

router.post('/',  async (req, res) => {
  try {
    // first pass is sequential, might be able parallelize somewhere
    const emsCall = await models.EmergencyMedicalServiceCall.create({
      dispatchCallNumber: req.body.dispatchCallNumber,
      startDateTime: '2004-10-19 10:23:54+02', // TODO - pull in a datetime lib
      CreatedById: req.user.id,
      UpdatedById: req.user.id,
    })
    // patient depends on emsCall
    const patient = await models.Patient.create({
      EmergencyMedicalServiceCallId: emsCall.id,
      patientNumber: 2, // TODO - where does this come from?
      age: req.body.patient.age,
      sex: req.body.patient.sex,
      stableIndicator: req.body.patient.stableIndicator,
      chiefComplaintDescription: req.body.patient.chiefComplaintDescription,
      heartRateBpm: req.body.patient.heartRateBpm,
      temperature: req.body.patient.temperature,
      systolicBloodPressure: req.body.patient.systolicBloodPressure,
      diastolicBloodPressure: req.body.patient.diastolicBloodPressure,
      respiratoryRate: req.body.respiratoryRate,
      oxygenSaturation: req.body.patient.oxygenSaturation,
      ivIndicator: req.body.patient.ivIndicator,
      combativeBehaviorIndicator: req.body.patient.combativeBehaviorIndicator,
      otherObservationNotes: req.body.patient.otherObservationNotes, 
      CreatedById: req.user.id,
      UpdatedById: req.user.id,
    })
    const ambulance = await models.Ambulance.findOne({
      where: {
        ambulanceIdentifier: req.body.ambulanceIdentifer
      }
    });
    // patientDelivery depends on ambulance
    await models.PatientDelivery.create({
      AmbulanceId: ambulance.id,
      PatientId: patient.id,
      HospitalId: req.body.hospitalId,
      ParamedicUserId: req.user.id,
      deliveryStatus: 'enroute', // TODO - make an enum?
      departureDateTime: '2004-10-19 10:23:54+02', // TODO - pull in a datetime lib
      CreatedById: req.user.id,
      UpdatedById: req.user.id,
    })

    res.status(HttpStatus.CREATED).json({
      // TODO - decide what to return
    });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  }

});

module.exports = router;
