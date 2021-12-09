module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.sequelize.query(`ALTER TYPE deliverystatus RENAME VALUE 'RINGDOWN RECEIVED' TO 'RINGDOWN CONFIRMED'`);
    await queryInterface.sequelize.query(`ALTER TYPE deliverystatus ADD VALUE 'RINGDOWN RECEIVED' BEFORE 'RINGDOWN CONFIRMED'`);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.sequelize.query(
      `UPDATE patientdelivery SET currentdeliverystatusenum='RINGDOWN RECEIVED' WHERE currentdeliverystatusenum='RINGDOWN CONFIRMED';`
    );
    await queryInterface.sequelize.query(`DELETE FROM patientdeliveryupdate WHERE deliverystatusenum='RINGDOWN CONFIRMED';`);
    await queryInterface.sequelize.query(`ALTER TYPE deliverystatus RENAME TO deliverystatus_old;`);
    await queryInterface.sequelize.query(
      `CREATE TYPE deliverystatus AS ENUM ('RINGDOWN SENT', 'RINGDOWN RECEIVED', 'ARRIVED', 'OFFLOADED', 'RETURNED TO SERVICE', 'CANCELLED', 'CANCEL ACKNOWLEGED', 'REDIRECTED', 'REDIRECT ACKNOWLEGED');`
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE patientdeliveryupdate ALTER COLUMN deliverystatusenum TYPE deliverystatus USING deliverystatusenum::text::deliverystatus;`
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE patientdelivery ALTER COLUMN currentdeliverystatusenum TYPE deliverystatus USING currentdeliverystatusenum::text::deliverystatus;`
    );
    await queryInterface.sequelize.query(`DROP TYPE deliverystatus_old;`);
  },
};
