const express = require('express');
const HttpStatus = require('http-status-codes');
const _ = require('lodash');
const { Op } = require('sequelize');
const { DeliveryStatus } = require('shared/constants');

const middleware = require('../../auth/middleware');
const models = require('../../models');
const { setPaginationHeaders, wrapper } = require('../helpers');

const { dispatchMciUpdate } = require('../../wss');

const router = express.Router();

async function resetMciCapacities(userId) {
  // check for active MCIs, if all closed, reset MCI counts for all hospitals
  return models.sequelize.transaction(async (transaction) => {
    const mcis = await models.MassCasualtyIncident.scope('active').findAll({ transaction });
    if (mcis.length === 0) {
      const statusUpdates = await models.HospitalStatusUpdate.scope('latest').findAll({
        transaction,
      });
      await Promise.all(
        statusUpdates.map((su) => {
          const data = {
            ..._.pick(su, [
              'HospitalId',
              'openEdBedCount',
              'openPsychBedCount',
              'bedCountUpdateDateTimeLocal',
              'divertStatusIncicator',
              'divertStatusUpdateDateTimeLocal',
              'additionalServiceAvailabilityNotes',
              'notesUpdateDateTimeLocal',
            ]),
            mciRedCapacity: null,
            mciYellowCapacity: null,
            mciGreenCapacity: null,
            mciUpdateDateTime: null,
            updateDateTimeLocal: new Date(),
            EdAdminUserId: userId,
            CreatedById: userId,
            UpdatedById: userId,
          };
          return models.HospitalStatusUpdate.create(data, { transaction });
        })
      );
    }
  });
}

router.get(
  '/',
  middleware.isC4SFUser,
  wrapper(async (req, res) => {
    const page = req.query.page || '1';
    const options = {
      page,
      order: [
        ['endedAt', 'DESC'],
        ['startedAt', 'DESC'],
      ],
    };
    const { records, pages, total } = await models.MassCasualtyIncident.paginate(options);
    setPaginationHeaders(req, res, page, pages, total);
    res.json(records.map((r) => r.toJSON()));
  })
);

router.post(
  '/',
  middleware.isC4SFUser,
  wrapper(async (req, res) => {
    const defaults = {
      ..._.pick(req.body, [
        'address1',
        'address2',
        'city',
        'state',
        'zip',
        'startedAt',
        'endedAt',
        'estimatedRedCount',
        'estimatedYellowCount',
        'estimatedGreenCount',
        'estimatedZebraCount',
        'treatedRedCount',
        'treatedYellowCount',
        'treatedGreenCount',
        'treatedZebraCount',
        'isExternallyUpdated',
      ]),
      CreatedById: req.user.id,
      UpdatedById: req.user.id,
    };
    let record;
    let isCreated;
    await models.sequelize.transaction(async (transaction) => {
      [record, isCreated] = await models.MassCasualtyIncident.findOrCreate({
        where: {
          incidentNumber: req.body.incidentNumber,
        },
        defaults,
        transaction,
      });
      if (!isCreated) {
        delete defaults.CreatedById;
        await record.update(defaults, { transaction });
      }
    });
    if (record) {
      if (isCreated) {
        res.status(HttpStatus.CREATED).json(record.toJSON());
      } else {
        res.status(HttpStatus.OK).json(record.toJSON());
      }
      await resetMciCapacities(req.user.id);
      await dispatchMciUpdate(record.id);
    } else {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
    }
  })
);

router.get('/:id/ringdowns', middleware.isC4SFUser, async (req, res) => {
  const record = await models.MassCasualtyIncident.findByPk(req.params.id);
  if (record) {
    const patientDeliveries = await models.PatientDelivery.findAll({
      include: [
        { model: models.Ambulance, include: models.Organization },
        models.Hospital,
        models.PatientDeliveryUpdate,
        {
          model: models.Patient,
          include: models.EmergencyMedicalServiceCall,
        },
      ],
      where: {
        currentDeliveryStatus: {
          [Op.lt]: DeliveryStatus.CANCELLED,
        },
        '$Patient.EmergencyMedicalServiceCall.dispatchcallnumber$': record.incidentNumber,
      },
    });
    res.json(await Promise.all(patientDeliveries.map((pd) => pd.toRingdownJSON())));
  } else {
    res.status(HttpStatus.NOT_FOUND).end();
  }
});

router.get('/:id', middleware.isC4SFUser, async (req, res) => {
  const record = await models.MassCasualtyIncident.findByPk(req.params.id);
  if (record) {
    res.json(record.toJSON());
  } else {
    res.status(HttpStatus.NOT_FOUND).end();
  }
});

router.patch(
  '/:id',
  middleware.isC4SFUser,
  wrapper(async (req, res) => {
    let record;
    await models.sequelize.transaction(async (transaction) => {
      record = await models.MassCasualtyIncident.findByPk(req.params.id, { transaction });
      if (record) {
        await record.update(
          _.pick(req.body, [
            'incidentNumber',
            'address1',
            'address2',
            'city',
            'state',
            'zip',
            'startedAt',
            'endedAt',
            'estimatedRedCount',
            'estimatedYellowCount',
            'estimatedGreenCount',
            'estimatedZebraCount',
            'treatedRedCount',
            'treatedYellowCount',
            'treatedGreenCount',
            'treatedZebraCount',
            'isExternallyUpdated',
          ]),
          { transaction }
        );
      }
    });
    if (record) {
      res.json(record.toJSON());
      await resetMciCapacities(req.user.id);
      await dispatchMciUpdate(record.id);
    } else {
      res.status(HttpStatus.NOT_FOUND).end();
    }
  })
);

module.exports = router;
