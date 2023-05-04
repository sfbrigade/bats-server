'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    CREATE TABLE federatedcredentials (
      federatedcredential_uuid    uuid              DEFAULT gen_random_uuid() NOT NULL,
      provider                    varchar(1000)             NOT NULL,
      subject                     varchar(1000)     UNIQUE  NOT NULL,
      user_id                     FOREIGN KEY       REFERENCES batsuser(user_uuid),
  );
  
  `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    DROP TABLE IF EXISTS federatedcredentials;
  `);
  },
};
