'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'hospitaluser',
        'infouserindicator',
        {
          field: 'infouserindicator',
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: true,
          allowNull: false,
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'hospitaluser',
        'ringdownuserindicator',
        {
          field: 'ringdownuserindicator',
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: true,
          allowNull: false,
        },
        { transaction }
      );
    });
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('hospitaluser', 'infouserindicator', { transaction });
      await queryInterface.removeColumn('hospitaluser', 'ringdownuserindicator', { transaction });
    });
  },
};
