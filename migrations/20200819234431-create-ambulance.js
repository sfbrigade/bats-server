'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Ambulances', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ambulance_uuid: {
        type: Sequelize.UUID
      },
      emergencymedicalserviceprovider_uuid: {
        type: Sequelize.UUID
      },
      ambulanceidentifier: {
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
    await queryInterface.dropTable('Ambulances');
  }
};