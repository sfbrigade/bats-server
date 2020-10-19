const express = require('express');
const HttpStatus = require('http-status-codes');

const models = require('../../models');

const router = express.Router();

function createHospitalStatusResponse() {

};

router.get('/', async(req, res) => {
  try {
    const hospitalStatuses = models.HospitalStatusUpdate.findAll({
      where: {

      }
    })

  res.status(HttpStatus.OK).json();
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  }
});

module.exports = router;