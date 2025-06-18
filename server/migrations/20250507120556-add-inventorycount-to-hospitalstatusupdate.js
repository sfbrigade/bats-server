/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('hospitalstatusupdate', 'custominventorycount', {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: null,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('hospitalstatusupdate', 'custominventorycount');
  },
};
