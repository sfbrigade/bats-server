/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('token', {
      token_uuid: {
        allowNull: false,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        type: Sequelize.UUID,
      },
      accesstoken: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      accesstokenexpiresat: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      client_uuid: {
        allowNull: false,
        type: Sequelize.UUID,
      },
      refreshtoken: {
        type: Sequelize.STRING,
      },
      refreshtokenexpiresat: {
        type: Sequelize.DATE,
      },
      user_uuid: {
        allowNull: false,
        type: Sequelize.UUID,
      },
      recordcreatetimestamp: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      recordcreateuser_uuid: {
        allowNull: false,
        type: Sequelize.UUID,
      },
      recordupdatetimestamp: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      recordupdateuser_uuid: {
        allowNull: false,
        type: Sequelize.UUID,
      },
    });
    await queryInterface.addConstraint('token', {
      type: 'PRIMARY KEY',
      fields: ['token_uuid'],
      name: 'token_pk',
    });
    await queryInterface.addConstraint('token', {
      type: 'FOREIGN KEY',
      fields: ['user_uuid'],
      name: 'token_batsuser_fk',
      references: {
        table: 'batsuser',
        field: 'user_uuid',
      },
    });
    await queryInterface.addConstraint('token', {
      type: 'FOREIGN KEY',
      fields: ['recordcreateuser_uuid'],
      name: 'token_batsuser_recordcreate_fk',
      references: {
        table: 'batsuser',
        field: 'user_uuid',
      },
    });
    await queryInterface.addConstraint('token', {
      type: 'FOREIGN KEY',
      fields: ['recordupdateuser_uuid'],
      name: 'token_batsuser_recordupdate_fk',
      references: {
        table: 'batsuser',
        field: 'user_uuid',
      },
    });
    await queryInterface.addIndex('token', {
      fields: ['accesstoken'],
      unique: true,
    });
    await queryInterface.addIndex('token', {
      fields: ['refreshtoken'],
      unique: true,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('token');
  },
};
