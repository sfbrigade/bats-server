/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('hospitalinvite', {
      hospitalinvite_uuid: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      hospital_uuid: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'hospital',
          },
          key: 'hospital_uuid',
        },
      },
      invite_uuid: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'invite',
          },
          key: 'invite_uuid',
        },
      },
      activeindicator: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      infouserindicator: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      ringdownuserindicator: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      recordcreateuser_uuid: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'batsuser',
          },
          key: 'user_uuid',
        },
      },
      recordcreatetimestamp: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      recordupdateuser_uuid: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'batsuser',
          },
          key: 'user_uuid',
        },
      },
      recordupdatetimestamp: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('hospitalinvite');
  },
};
