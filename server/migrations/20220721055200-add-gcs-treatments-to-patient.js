module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn('patient', 'treatmentnotes', Sequelize.TEXT, { transaction });
      await queryInterface.addColumn('patient', 'glasgowcomascale', Sequelize.INTEGER, { transaction });
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('patient', 'glasgowcomascale', { transaction });
      await queryInterface.removeColumn('patient', 'treatmentnotes', { transaction });
    });
  },
};
