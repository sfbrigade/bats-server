const express = require('express');
const HttpStatus = require('http-status-codes');
const _ = require('lodash');

const { DeliveryStatus } = require('shared/constants');

const middleware = require('../../auth/middleware');
const models = require('../../models');
const rollbar = require('../../lib/rollbar');

const { dispatchRingdownUpdate } = require('../../wss');
const { setPaginationHeaders } = require('../helpers');

const router = express.Router();

router.get(
  '/:id([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})',
  middleware.isAuthenticated,
  async (req, res) => {
    try {
      let patientDelivery;
      await models.sequelize.transaction(async (transaction) => {
        patientDelivery = await models.PatientDelivery.findByPk(req.params.id, {
          include: { all: true },
          rejectOnEmpty: true,
          transaction,
        });
        // check if calling user is allowed to access this record
        if (req.user.id !== patientDelivery.ParamedicUserId && req.user.OrganizationId !== patientDelivery.ParamedicUser.OrganizationId) {
          // check if user is in the receiving hospital ED
          const hospitalUser = await models.HospitalUser.findOne({
            where: {
              HospitalId: patientDelivery.HospitalId,
              EdAdminUserId: req.user.id,
            },
            transaction,
          });
          if (!hospitalUser || !req.user.isOperationalUser) {
            res.status(HttpStatus.FORBIDDEN).end();
            patientDelivery = null;
          }
        }
      });
      if (patientDelivery) {
        res.json(await patientDelivery.toRingdownJSON());
      }
    } catch (error) {
      rollbar.error(error, req);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
    }
  }
);

router.get('/:scope?', middleware.isAuthenticated, async (req, res) => {
  const queryFilter = {};

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
    rollbar.error(error, req);
    res.status(HttpStatus.FORBIDDEN).end();
  }

  try {
    const page = req.query.page || '1';
    const { records, pages, total } = await models.PatientDelivery.paginate({
      page,
      include: [
        { model: models.Patient, include: models.EmergencyMedicalServiceCall },
        { model: models.Ambulance, include: models.Organization },
        models.Hospital,
        models.PatientDeliveryUpdate,
      ],
      where: queryFilter,
      order: [['createdAt', 'DESC']],
    });
    const response = await Promise.all(records.map((pd) => pd.toRingdownJSON()));
    setPaginationHeaders(req, res, page, pages, total);
    res.status(HttpStatus.OK).json(response);
  } catch (error) {
    rollbar.error(error, req);
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
    return;
  }
  try {
    let patientDelivery;
    let json;
    for (let key in req.body.patient) {
      if (req.body.patient[key] === '') {
        req.body.patient[key] = null;
      }
    }
    await models.sequelize.transaction(async (transaction) => {
      const [emsCall] = await models.EmergencyMedicalServiceCall.findOrCreate({
        where: {
          dispatchCallNumber: req.body.emsCall.dispatchCallNumber,
        },
        defaults: {
          startDateTimeLocal: new Date(),
          CreatedById: req.user.id,
          UpdatedById: req.user.id,
        },
        transaction,
      });
      const patient = await models.Patient.create(
        {
          ..._.pick(req.body.patient, models.Patient.Params),
          EmergencyMedicalServiceCallId: emsCall.id,
          CreatedById: req.user.id,
          UpdatedById: req.user.id,
        },
        { transaction }
      );
      patient.EmergencyMedicalServiceCall = emsCall;
      // check if patient is from an MCI
      const isMCI = !!patient.triageTag || !!patient.triagePriority;
      // allow setting/creating ambulance record for other agencies in MCI
      let { OrganizationId } = req.user;
      if (isMCI && req.body.ambulance.organization) {
        const { state, stateUniqueId } = req.body.ambulance.organization;
        const organization = await models.Organization.findOne({
          where: {
            state,
            stateUniqueId,
          },
          rejectOnEmpty: true,
          transaction,
        });
        OrganizationId = organization.id;
      }
      const [ambulance] = await models.Ambulance.findOrCreate({
        where: {
          OrganizationId,
          ambulanceIdentifier: req.body.ambulance.ambulanceIdentifier,
        },
        defaults: {
          CreatedById: req.user.id,
          UpdatedById: req.user.id,
        },
        transaction,
      });
      const hospital = await models.Hospital.findByPk(req.body.hospital.id, { transaction });
      patientDelivery = await models.PatientDelivery.createRingdown(
        ambulance.id,
        patient.id,
        hospital.id,
        req.user.id,
        req.body.patientDelivery.dateTimeLocal || new Date(),
        req.body.patientDelivery.etaMinutes,
        { transaction }
      );
      patientDelivery.Ambulance = ambulance;
      patientDelivery.Patient = patient;
      patientDelivery.Hospital = hospital;
      json = await patientDelivery.toRingdownJSON({ transaction });
    });
    if (json) {
      res.status(HttpStatus.CREATED).json(json);
    }
    if (patientDelivery) {
      await dispatchRingdownUpdate(patientDelivery.id);
    }
  } catch (error) {
    rollbar.error(error, req);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  }
});

router.patch('/:id/deliveryStatus', middleware.isAuthenticated, async (req, res) => {
  try {
    let patientDelivery;
    let json;
    await models.sequelize.transaction(async (transaction) => {
      patientDelivery = await models.PatientDelivery.findByPk(req.params.id, {
        include: { all: true },
        rejectOnEmpty: true,
        transaction,
      });
      const { deliveryStatus, dateTimeLocal } = req.body;
      // check if patient is from an MCI
      const isMCI = !!patientDelivery.Patient.triageTag || !!patientDelivery.Patient.triagePriority;
      // check if calling user is allowed to modify this record
      if (!isMCI && !req.user.isSuperUser && req.user.id !== patientDelivery.CreatedById) {
        if (
          deliveryStatus === DeliveryStatus.RINGDOWN_RECEIVED ||
          deliveryStatus === DeliveryStatus.RINGDOWN_CONFIRMED ||
          deliveryStatus === DeliveryStatus.OFFLOADED_ACKNOWLEDGED ||
          deliveryStatus === DeliveryStatus.CANCEL_ACKNOWLEDGED ||
          deliveryStatus === DeliveryStatus.REDIRECT_ACKNOWLEDGED
        ) {
          const hospital = await patientDelivery.getHospital({ include: [models.Organization], transaction });
          // TODO: figure out permissions for venues
          if (hospital.Organization.type !== 'VENUE') {
            // check if user is in the receiving hospital ED
            const options = {
              where: {
                HospitalId: patientDelivery.HospitalId,
                EdAdminUserId: req.user.id,
              },
              transaction,
            };
            // when showing ringdowns from all hospitals for testing, also
            // allow any hospital user to update its delivery status
            if (process.env.REACT_APP_PILOT_SHOW_ALL_RINGDOWNS === 'true') {
              delete options.where.HospitalId;
            }
            const hospitalUser = await models.HospitalUser.findOne(options);
            if (!hospitalUser || !req.user.isOperationalUser) {
              res.status(HttpStatus.FORBIDDEN).end();
              return;
            }
            return;
          }
        } else {
          res.status(HttpStatus.FORBIDDEN).end();
          return;
        }
      }
      // update status
      try {
        await patientDelivery.createDeliveryStatusUpdate(req.user.id, deliveryStatus, dateTimeLocal, { transaction });
      } catch (error) {
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).end();
        return;
      }
      json = await patientDelivery.toRingdownJSON({ transaction });
    });
    if (json) {
      res.status(HttpStatus.OK).json(json);
    }
    if (patientDelivery) {
      await dispatchRingdownUpdate(patientDelivery.id);
    }
  } catch (error) {
    rollbar.error(error, req);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  }
});

router.patch('/:id', middleware.isAuthenticated, async (req, res) => {
  try {
    let patientDelivery;
    let json;
    await models.sequelize.transaction(async (transaction) => {
      patientDelivery = await models.PatientDelivery.findByPk(req.params.id, {
        include: { all: true },
        rejectOnEmpty: true,
        transaction,
      });

      // check if calling user is allowed to modify this record
      if (req.user.id !== patientDelivery.CreatedById) {
        // check if user is in the receiving hospital ED
        const hospitalUser = await models.HospitalUser.findOne({
          where: {
            HospitalId: patientDelivery.HospitalId,
            EdAdminUserId: req.user.id,
          },
          transaction,
        });
        if (!hospitalUser || !req.user.isOperationalUser) {
          res.status(HttpStatus.FORBIDDEN).end();
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
        Object.assign(patientDelivery.Patient, _.pick(req.body.patient, models.Patient.Params));
        await patientDelivery.Patient.save({ transaction });
      }

      if (req.body.patientDelivery) {
        // only allow updates to eta in PatientDelivery- all other state changes should use above route
        Object.assign(patientDelivery, _.pick(req.body.patientDelivery, ['etaMinutes']));
      }

      await patientDelivery.save({ transaction });
      json = await patientDelivery.toRingdownJSON({ transaction });
    });
    if (json) {
      res.status(HttpStatus.OK).json(json);
    }
    if (patientDelivery) {
      await dispatchRingdownUpdate(patientDelivery.id);
    }
  } catch (error) {
    rollbar.error(error, req);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  }
});

module.exports = router;
