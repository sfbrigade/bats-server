'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('EmergencyMedicalServiceCalls', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      emergencymedicalservicecall_uuid: {
        type: Sequelize.UUID
      },
      dispatchcallnumber: {
        type: Sequelize.INTEGER
      },
      startdatetime: {
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
    await queryInterface.dropTable('EmergencyMedicalServiceCalls');
  }
};