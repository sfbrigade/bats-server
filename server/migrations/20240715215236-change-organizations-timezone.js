/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('organization', 'timezoneisocode', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn('organization', 'timezoneisocode', {
      type: Sequelize.STRING,
      defaultValue: 'America/Los_Angeles',
    });
    await queryInterface.renameColumn('organization', 'timezoneisocode', 'timezone');
    await queryInterface.sequelize.query(`UPDATE organization SET timezone='America/Los_Angeles' WHERE timezone='PST'`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`UPDATE organization SET timezone='PST' WHERE timezone='America/Los_Angeles'`);
    await queryInterface.renameColumn('organization', 'timezone', 'timezoneisocode');
    await queryInterface.changeColumn('organization', 'timezoneisocode', {
      type: Sequelize.CHAR(3),
      allowNull: false,
    });
    await queryInterface.changeColumn('organization', 'timezoneisocode', {
      type: Sequelize.CHAR(3),
      defaultValue: 'PST',
    });
  },
};
