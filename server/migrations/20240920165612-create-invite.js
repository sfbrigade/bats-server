/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('invites', {
      invite_uuid: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      organization_uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: 'organization',
          },
          key: 'organization_uuid',
        },
      },
      firstname: {
        type: Sequelize.STRING,
      },
      lastname: {
        type: Sequelize.STRING,
      },
      email: {
        allowNull: false,
        type: Sequelize.CITEXT,
      },
      message: {
        type: Sequelize.TEXT,
      },
      operationaluserindicator: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      administrativeuserindicator: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      superuserindicator: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      resentuser_uuid: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'batsuser',
          },
          key: 'user_uuid',
        },
      },
      resenttimestamp: {
        type: Sequelize.DATE,
      },
      accepteduser_uuid: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'batsuser',
          },
          key: 'user_uuid',
        },
      },
      acceptedtimestamp: {
        type: Sequelize.DATE,
      },
      revokeduser_uuid: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'batsuser',
          },
          key: 'user_uuid',
        },
      },
      revokedtimestamp: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('invites');
  },
};
