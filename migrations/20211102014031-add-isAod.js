'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction( async (transaction) => {
      await queryInterface.addColumn('hospitaluser', 'isAod', {
          field: 'isAod',
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: false,
          allowNull: false
        }, { transaction });
    });
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.transaction( async (transaction) => {
      await queryInterface.removeColumn('hospitaluser', 'isAod', {transaction});
  });
},

}
