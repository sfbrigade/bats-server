/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`ALTER TYPE organizationtype ADD VALUE 'VENUE'`);
  },

  async down(queryInterface, Sequelize) {
    // Note: PostgreSQL does not support removing enum values
    // The best we can do is create a new type without the value and swap it
    await queryInterface.sequelize.query(`
      ALTER TABLE organization 
      ALTER COLUMN organizationtypeenum TYPE VARCHAR;
      
      DROP TYPE organizationtype;
      CREATE TYPE organizationtype AS ENUM ('EMS', 'HEALTHCARE', 'C4SF');

      ALTER TABLE organization 
      ALTER COLUMN organizationtypeenum TYPE organizationtype 
      USING organizationtypeenum::organizationtype;
    `);
  },
};
