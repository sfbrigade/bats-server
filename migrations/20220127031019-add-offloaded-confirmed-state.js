module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.sequelize.query(`ALTER TYPE deliverystatus ADD VALUE 'OFFLOADED ACKNOWLEDGED' BEFORE 'RETURNED TO SERVICE'`);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.sequelize.query(`DELETE FROM patientdeliveryupdate WHERE deliverystatusenum='OFFLOADED ACKNOWLEDGED';`);
    await queryInterface.sequelize.query(`ALTER TYPE deliverystatus RENAME TO deliverystatus_old;`);
    await queryInterface.sequelize.query(
      `CREATE TYPE deliverystatus AS ENUM ('RINGDOWN SENT', 'RINGDOWN RECEIVED', 'RINGDOWN CONFIRMED', 'ARRIVED', 'OFFLOADED', 'RETURNED TO SERVICE', 'CANCELLED', 'CANCEL ACKNOWLEGED', 'REDIRECTED', 'REDIRECT ACKNOWLEGED');`
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
