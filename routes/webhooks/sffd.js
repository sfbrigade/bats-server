const express = require('express');
const HttpStatus = require('http-status-codes');

const models = require('../../models');

const router = express.Router();

const UNIT_SFFD_REGEX = /^\d+$/;
const UNIT_AM_REGEX = /^AM\d+$/;
const UNIT_KM_REGEX = /^KM\d+$/;

router.post('/cad', async (req, res) => {
  const data = req.body;
  if (!Array.isArray(data)) {
    return;
  }
  await models.sequelize.transaction(async (transaction) => {
    const superUser = await models.User.findOne({
      where: { email: 'batsadmin@c4sf.me' },
      transaction,
    });
    const sffd = await models.Organization.findOne({
      where: { name: 'San Francisco Fire Department' },
      transaction,
    });
    const am = await models.Organization.findOne({
      where: { name: 'American Medical Response (AMR)' },
      transaction,
    });
    const km = await models.Organization.findOne({
      where: { name: 'King American' },
      transaction,
    });
    const units = {};
    const incidents = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const record of data) {
      const { UNIT, INC_NO, DISPATCH_DTTM } = record;
      // skip records with no incident number
      if (!INC_NO) {
        // eslint-disable-next-line no-continue
        continue;
      }
      if (!units[UNIT]) {
        let org = null;
        if (UNIT_SFFD_REGEX.test(UNIT)) {
          org = sffd;
        } else if (UNIT_AM_REGEX.test(UNIT)) {
          org = am;
        } else if (UNIT_KM_REGEX.test(UNIT)) {
          org = km;
        }
        if (org) {
          // eslint-disable-next-line no-await-in-loop
          const [unit] = await models.Ambulance.findOrCreate({
            where: {
              OrganizationId: org.id,
              ambulanceIdentifier: UNIT,
            },
            defaults: {
              CreatedById: superUser.id,
              UpdatedById: superUser.id,
            },
            transaction,
          });
          units[UNIT] = unit;
        }
      }
      if (!incidents[INC_NO]) {
        // eslint-disable-next-line no-await-in-loop
        const [emsCall] = await models.EmergencyMedicalServiceCall.findOrCreate({
          where: {
            dispatchCallNumber: INC_NO,
          },
          defaults: {
            startDateTimeLocal: DISPATCH_DTTM,
            CreatedById: superUser.id,
            UpdatedById: superUser.id,
          },
          transaction,
        });
        incidents[INC_NO] = emsCall;
      }
      if (units[UNIT] && incidents[INC_NO]) {
        // eslint-disable-next-line no-await-in-loop
        await models.EmergencyMedicalServiceCallAmbulance.findOrCreate({
          where: {
            EmergencyMedicalServiceCallId: incidents[INC_NO].id,
            AmbulanceId: units[UNIT].id,
            startDateTimeLocal: DISPATCH_DTTM,
          },
          defaults: {
            CreatedById: superUser.id,
            UpdatedById: superUser.id,
          },
          transaction,
        });
      }
    }
  });
  res.status(HttpStatus.OK).end();
});

module.exports = router;
