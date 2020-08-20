'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('EmergencyMedicalServiceProviders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      emergencymedicalserviceprovider_uuid: {
        type: Sequelize.UUID
      },
      emergencymedicalserviceprovidername: {
        type: Sequelize.TEXT
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
        type: Sequelize.CHAR
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
    await queryInterface.dropTable('EmergencyMedicalServiceProviders');
  }
};