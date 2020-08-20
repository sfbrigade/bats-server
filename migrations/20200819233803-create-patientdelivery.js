'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Patientdeliveries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      patientdelivery_uuid: {
        type: Sequelize.UUID
      },
      ambulance_uuid: {
        type: Sequelize.UUID
      },
      patient_uuid: {
        type: Sequelize.UUID
      },
      hospital_uuid: {
        type: Sequelize.UUID
      },
      deliverystatus: {
        type: Sequelize.TEXT
      },
      departuredatetime: {
        type: Sequelize.DATE
      },
      estimatedarrivaltime: {
        type: Sequelize.DATE
      },
      arrivaldatetime: {
        type: Sequelize.DATE
      },
      admissiondatetime: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('Patientdeliveries');
  }
};