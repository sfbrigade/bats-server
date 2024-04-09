/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('hospitalstatusupdate', 'mciredcapacity', {
      type: Sequelize.SMALLINT,
    });
    await queryInterface.addColumn('hospitalstatusupdate', 'mciyellowcapacity', {
      type: Sequelize.SMALLINT,
    });
    await queryInterface.addColumn('hospitalstatusupdate', 'mcigreencapacity', {
      type: Sequelize.SMALLINT,
    });
    await queryInterface.addColumn('hospitalstatusupdate', 'mciupdatedatetime', {
      type: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('hospitalstatusupdate', 'mciredcapacity');
    await queryInterface.removeColumn('hospitalstatusupdate', 'mciyellowcapacity');
    await queryInterface.removeColumn('hospitalstatusupdate', 'mcigreencapacity');
  },
};
