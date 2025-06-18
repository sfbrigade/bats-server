/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('assignment', {
      assignment_uuid: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      fromorganization_uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'organization',
          key: 'organization_uuid',
        },
      },
      toorganization_uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'organization',
          key: 'organization_uuid',
        },
      },
      recordcreatetimestamp: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      recordcreateuser_uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'batsuser',
          key: 'user_uuid',
        },
      },
      recorddeletetimestamp: {
        type: Sequelize.DATE,
      },
      recorddeleteuser_uuid: {
        type: Sequelize.UUID,
        references: {
          model: 'batsuser',
          key: 'user_uuid',
        },
      },
      recordupdatetimestamp: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      recordupdateuser_uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'batsuser',
          key: 'user_uuid',
        },
      },
    });
    await queryInterface.sequelize.query(
      'CREATE UNIQUE INDEX assignment_from_to_uk ON assignment (fromorganization_uuid, toorganization_uuid) WHERE recorddeletetimestamp IS NULL'
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('assignment');
  },
};
