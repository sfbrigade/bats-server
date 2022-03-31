module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('organization', 'organizationstate', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('organization', 'organizationstateuniqueid', {
      type: Sequelize.STRING,
    });
    await queryInterface.addIndex('organization', {
      fields: ['organizationtypeenum', 'organizationstate', 'organizationstateuniqueid'],
      unique: true,
    });
    await queryInterface.sequelize.query(`UPDATE organization SET organizationstate='06'`);
    await queryInterface.sequelize.query(
      `UPDATE organization SET organizationstateuniqueid='S38-50827' WHERE organizationname='San Francisco Fire Department'`
    );
    await queryInterface.sequelize.query(
      `UPDATE organization SET organizationstateuniqueid='S39-50088' WHERE organizationname='American Medical Response (AMR)'`
    );
    await queryInterface.sequelize.query(
      `UPDATE organization SET organizationstateuniqueid='S3850502' WHERE organizationname='King American'`
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('organization', 'organizationstateuniqueid');
    await queryInterface.removeColumn('organization', 'organizationstate');
  },
};
