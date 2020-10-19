const express = require('express');
const { Op } = require('sequelize');
const HttpStatus = require('http-status-codes');

const models = require('../../models');

const router = express.Router();

function createRingdownResponse(ambulance, emsCall, hospital, patient, patientDelivery) {
  const ringdownResponse = {
    id: patientDelivery.id,
    ambulance: {
      ambulanceIdentifier: ambulance.ambulanceIdentifier,
    },
    emsCall: {
      dispatchCallNumber: emsCall.dispatchCallNumber,
    },
    hospital: {
      id: hospital.id,
    },
    patient: {
      age: patient.age,
      sex: patient.sex,
      patientNumber: patient.patientNumber,
      chiefComplaintDescription: patient.chiefComplaintDescription,
      systolicBloodPressure: patient.systolicBloodPressure,
      diastolicBloodPressure: patient.diastolicBloodPressure,
      heartRateBpm: patient.heartRateBpm,
      oxygenSaturation: patient.oxygenSaturation,
      temperature: patient.temperature,
      stableIndicator: patient.stableIndicator,
      combativeBehaviorIndicator: patient.combativeBehaviorIndicator,
      ivIndicator: patient.ivIndicator,
      otherObservationNotes: patient.otherObservationNotes,
    },
    patientDelivery: {
      deliveryStatus: patientDelivery.deliveryStatus,
      departureDateTime: patientDelivery.departureDateTime,
      estimatedArrivalTime: patientDelivery.estimatedArrivalTime,
      arrivalDateTime: patientDelivery.arrivalDateTime,
      admissionDateTime: patientDelivery.admissionDateTime,
    },
  };

  return ringdownResponse;
}

router.get('/', async (req, res) => {
  const filter = {
    deliveryStatus: {
      [Op.not]: 'Arrived',
    },
  };

  if (req.query.hospitalId) {
    filter.HospitalId = req.query.hospitalId;
  }

  try {
    const patientDeliveries = await models.PatientDelivery.findAll({
      include: { all: true },
      where: filter,
    });
    const response = await Promise.all(
      patientDeliveries.map(async (pd) => {
        const ems = await pd.Patient.getEmergencyMedicalServiceCall();
        const ringdown = createRingdownResponse(pd.Ambulance, ems, pd.Hospital, pd.Patient, pd);
        return ringdown;
      })
    );
    res.status(HttpStatus.OK).json(response);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  }
});

router.post('/', async (req, res) => {
  // TODO - store dates in UTC or local timezone?
  // TODO - use a transaction
  try {
    const emsCall = await models.EmergencyMedicalServiceCall.create({
      dispatchCallNumber: req.body.emsCall.dispatchCallNumber,
      startDateTime: new Date(),
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
      deliveryStatus: 'En route',
      departureDateTime: new Date(),
      CreatedById: req.user.id,
      UpdatedById: req.user.id,
    });
    const response = createRingdownResponse(ambulance, emsCall, hospital, patient, patientDelivery);
    res.status(HttpStatus.CREATED).json(response);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const patientDelivery = await models.PatientDelivery.findByPk(req.params.id, {
      include: { all: true },
    });

    if (!patientDelivery) {
      throw new Error('Patient delivery does not exist');
    }

    if (req.body.ambulance) {
      const ambulance = await models.Ambulance.findOne({
        where: {
          ambulanceIdentifier: req.body.ambulance.ambulanceIdentifer,
        },
      });
      patientDelivery.Ambulance = ambulance;
    }

    if (req.body.emsCall) {
      const emsCall = await patientDelivery.Patient.getEmergencyMedicalServiceCall();
      emsCall.dispatchCallNumber = req.body.emsCall.dispatchCallNumber;
      await emsCall.save();
    }

    if (req.body.hospital) {
      patientDelivery.HospitalId = req.body.hospital.id;
    }

    if (req.body.patient) {
      Object.assign(patientDelivery.Patient, req.body.patient);
    }

    if (req.body.patientDelivery) {
      Object.assign(patientDelivery, req.body.patientDelivery);
      if (req.body.patientDelivery.arrivalDateTime) {
        patientDelivery.deliveryStatus = 'Arrived';
      }
    }

    const updatedPatientDelivery = await patientDelivery.save();
    const emsCall = await updatedPatientDelivery.Patient.getEmergencyMedicalServiceCall();
    const response = createRingdownResponse(
      updatedPatientDelivery.Ambulance,
      emsCall,
      updatedPatientDelivery.Hospital,
      updatedPatientDelivery.Patient,
      updatedPatientDelivery
    );
    res.status(HttpStatus.OK).json(response);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  }
});

module.exports = router;
