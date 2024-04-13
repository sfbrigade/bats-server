/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('masscasualtyincident', 'treatedredcount', {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn('masscasualtyincident', 'treatedyellowcount', {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn('masscasualtyincident', 'treatedgreencount', {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn('masscasualtyincident', 'treatedzebracount', {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn('masscasualtyincident', 'externallyupdatedindicator', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('masscasualtyincident', 'externallyupdatedindicator');
    await queryInterface.removeColumn('masscasualtyincident', 'treatedzebracount');
    await queryInterface.removeColumn('masscasualtyincident', 'treatedgreencount');
    await queryInterface.removeColumn('masscasualtyincident', 'treatedyellowcount');
    await queryInterface.removeColumn('masscasualtyincident', 'treatedredcount');
  },
};
