/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('emergencymedicalservicecall', 'dispatchcallnumber', {
      type: `VARCHAR(50) USING CAST("dispatchcallnumber" AS VARCHAR(50))`,
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('emergencymedicalservicecall', 'dispatchcallnumber', {
      type: `INTEGER USING CAST("dispatchcallnumber" AS INTEGER)`,
      allowNull: false,
    });
  }
};
