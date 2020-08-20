'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Patients', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      patient_uuid: {
        type: Sequelize.UUID
      },
      patientnumber: {
        type: Sequelize.INTEGER
      },
      age: {
        type: Sequelize.SMALLINT
      },
      sex: {
        type: Sequelize.TEXT
      },
      stableindicator: {
        type: Sequelize.BOOLEAN
      },
      chiefcomplaintdescription: {
        type: Sequelize.STRING
      },
      heartratebpm: {
        type: Sequelize.INTEGER
      },
      temperature: {
        type: Sequelize.INTEGER
      },
      systolicbloodpressure: {
        type: Sequelize.INTEGER
      },
      diastolicbloodpressure: {
        type: Sequelize.INTEGER
      },
      respiratoryrate: {
        type: Sequelize.SMALLINT
      },
      oxygensaturation: {
        type: Sequelize.SMALLINT
      },
      ivindicator: {
        type: Sequelize.SMALLINT
      },
      combativebehaviorindicator: {
        type: Sequelize.BOOLEAN
      },
      otherobservationnotes: {
        type: Sequelize.TEXT
      },
      emergencymedicalservicecall_uuid: {
        type: Sequelize.UUID
      },
      recordcreatetimestamp: {
        type: Sequelize.DATE
      },
      recordcreatesource: {
        type: Sequelize.TEXT
      },
      recordupdatetimestamp: {
        type: Sequelize.DATE
      },
      recordupdatesource: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Patients');
  }
};