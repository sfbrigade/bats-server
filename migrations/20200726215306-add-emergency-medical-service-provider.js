'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const CREATE_EMSP_TABLE = `
      CREATE TABLE emergency_medical_service_provider(
        emergency_medical_service_provider_id SERIAL PRIMARY KEY,
        emergency_medical_service_provider_name TEXT
      );
    `;
    await queryInterface.sequelize.query(CREATE_EMSP_TABLE);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.sequelize.query('DROP TABLE emergency_medical_service_provider;');
  }
};
