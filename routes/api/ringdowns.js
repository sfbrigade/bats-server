const express = require('express');
const { Op } = require('sequelize');
const HttpStatus = require('http-status-codes');
const _ = require('lodash');

const middleware = require('../../auth/middleware');
const models = require('../../models');

const router = express.Router();

const patientParams = [
  'age',
  'sex',
  'emergencyServiceResponseType',
  'chiefComplaintDescription',
  'stableIndicator',
  'systolicBloodPressure',
  'diastolicBloodPressure',
  'heartRateBpm',
  'respiratoryRate',
  'oxygenSaturation',
  'lowOxygenResponseType',
  'supplementalOxygenAmount',
  'temperature',
  'etohSuspectedIndicator',
  'drugsSuspectedIndicator',
  'psychIndicator',
  'combativeBehaviorIndicator',
  'restraintIndicator',
  'covid19SuspectedIndicator',
  'ivIndicator',
  'otherObservationNotes',
];

const patientDeliveryParams = [
  'deliveryStatus',
  'etaMinutes',
  'ringdownSentDateTimeLocal',
  'ringdownReceivedDateTimeLocal',
  'arrivedDateTimeLocal',
  'offloadedDateTimeLocal',
  'returnToServiceDateTimeLocal',
];

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
      name: hospital.name,
    },
    patient: _.pick(patient, patientParams),
    patientDelivery: _.pick(patientDelivery, patientDeliveryParams),
  };
  return ringdownResponse;
}

router.get('/:scope?', middleware.isAuthenticated, async (req, res) => {
  const queryFilter = {
    deliveryStatus: {
      [Op.lt]: 'RETURNED TO SERVICE',
    },
  };

  try {
    if (req.query.hospitalId) {
      queryFilter.HospitalId = req.query.hospitalId;
      // ensure auth user is either a superuser or an administrator of this hospital ED
      if (!req.user.isSuperUser) {
        await models.HospitalUser.findOne({
          where: {
            HospitalId: req.query.hospitalId,
            EdAdminUserId: req.user.id,
          },
          rejectOnEmpty: true,
        });
      }
    } else if (req.params.scope === 'mine') {
      queryFilter.ParamedicUserId = req.user.id;
      // ensure auth user is part of an EMS organization
      const org = await req.user.getOrganization();
      if (org.type !== 'EMS') {
        throw new Error();
      }
    } else if (!req.user.isSuperUser) {
      // must be a superuser to see ringdowns for ALL hospitals
      throw new Error();
    }
  } catch (error) {
    res.status(HttpStatus.FORBIDDEN).end();
  }

  try {
    const patientDeliveries = await models.PatientDelivery.findAll({
      include: { all: true },
      where: queryFilter,
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

router.post('/', middleware.isAuthenticated, async (req, res) => {
  try {
    // ensure auth user is part of an EMS organization
    const org = await req.user.getOrganization();
    if (org.type !== 'EMS') {
      throw new Error();
    }
    // ensure authenticated user is an operational user allowed to do this
    if (!req.user.isOperationalUser) {
      throw new Error();
    }
  } catch (error) {
    res.status(HttpStatus.FORBIDDEN).end();
  }
  try {
    await models.sequelize.transaction(async (transaction) => {
      const emsCall = await models.EmergencyMedicalServiceCall.create(
        {
          dispatchCallNumber: req.body.emsCall.dispatchCallNumber,
          startDateTimeLocal: new Date(),
          CreatedById: req.user.id,
          UpdatedById: req.user.id,
        },
        { transaction }
      );
      const patient = await models.Patient.create(
        {
          ..._.pick(req.body.patient, patientParams),
          EmergencyMedicalServiceCallId: emsCall.id,
          CreatedById: req.user.id,
          UpdatedById: req.user.id,
        },
        { transaction }
      );
      const [ambulance] = await models.Ambulance.findOrCreate({
        where: {
          OrganizationId: req.user.OrganizationId,
          ambulanceIdentifier: req.body.ambulance.ambulanceIdentifier,
        },
        defaults: {
          CreatedById: req.user.id,
          UpdatedById: req.user.id,
        },
        transaction,
      });
      const hospital = await models.Hospital.findByPk(req.body.hospital.id, { transaction });
      const patientDelivery = await models.PatientDelivery.create(
        {
          AmbulanceId: ambulance.id,
          PatientId: patient.id,
          HospitalId: hospital.id,
          ParamedicUserId: req.user.id,
          deliveryStatus: 'RINGDOWN SENT',
          etaMinutes: req.body.patientDelivery.etaMinutes,
          ringdownSentDateTimeLocal: new Date(),
          CreatedById: req.user.id,
          UpdatedById: req.user.id,
        },
        { transaction }
      );
      const response = createRingdownResponse(ambulance, emsCall, hospital, patient, patientDelivery);
      res.status(HttpStatus.CREATED).json(response);
    });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  }
});

router.patch('/:id', middleware.isAuthenticated, async (req, res) => {
  try {
    await models.sequelize.transaction(async (transaction) => {
      const patientDelivery = await models.PatientDelivery.findByPk(req.params.id, {
        include: { all: true },
        rejectOnEmpty: true,
        transaction,
      });

      // check if calling user is allowed to modify this record
      if (req.user.id !== patientDelivery.CreatedById) {
        // check if user is in the receiving hospital ED
        const hospitalUser = await models.HospitalUser.findOne({
          where: {
            HospitalId: patientDelivery.hospitalId,
            EdAdminUserId: req.user.id,
          },
          transaction,
        });
        if (!hospitalUser || !hospitalUser.isOperationalUser) {
          req.send(HttpStatus.FORBIDDEN).end();
          return;
        }
      }

      if (req.body.ambulance) {
        const [ambulance] = await models.Ambulance.findOrCreate({
          where: {
            OrganizationId: req.user.OrganizationId,
            ambulanceIdentifier: req.body.ambulance.ambulanceIdentifier,
          },
          defaults: {
            CreatedById: req.user.id,
            UpdatedById: req.user.id,
          },
          transaction,
        });
        patientDelivery.Ambulance = ambulance;
      }

      const emsCall = await patientDelivery.Patient.getEmergencyMedicalServiceCall({ transaction });
      if (req.body.emsCall) {
        emsCall.dispatchCallNumber = req.body.emsCall.dispatchCallNumber;
        await emsCall.save({ transaction });
      }

      if (req.body.hospital) {
        patientDelivery.HospitalId = req.body.hospital.id;
      }

      if (req.body.patient) {
        Object.assign(patientDelivery.Patient, _.pick(req.body.patient, patientParams));
      }

      if (req.body.patientDelivery) {
        Object.assign(patientDelivery, _.pick(req.body.patientDelivery, patientDeliveryParams));
        if (req.body.patientDelivery.arriveDateTimeLocal) {
          patientDelivery.deliveryStatus = 'ARRIVED';
        }
      }

      await patientDelivery.save({ transaction });
      const response = createRingdownResponse(
        patientDelivery.Ambulance,
        emsCall,
        patientDelivery.Hospital,
        patientDelivery.Patient,
        patientDelivery
      );
      res.status(HttpStatus.OK).json(response);
    });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  }
});

module.exports = router;
