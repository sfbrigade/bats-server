/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('client', {
      client_uuid: {
        allowNull: false,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        type: Sequelize.UUID,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      clientid: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      hashedclientsecret: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      user_uuid: {
        type: Sequelize.UUID,
      },
      redirecturi: {
        type: Sequelize.TEXT,
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
    await queryInterface.addConstraint('client', {
      type: 'PRIMARY KEY',
      fields: ['client_uuid'],
      name: 'client_pk',
    });
    await queryInterface.addConstraint('client', {
      type: 'FOREIGN KEY',
      fields: ['user_uuid'],
      name: 'client_batsuser_fk',
      references: {
        table: 'batsuser',
        field: 'user_uuid',
      },
    });
    await queryInterface.addConstraint('client', {
      type: 'FOREIGN KEY',
      fields: ['recordcreateuser_uuid'],
      name: 'client_batsuser_recordcreate_fk',
      references: {
        table: 'batsuser',
        field: 'user_uuid',
      },
    });
    await queryInterface.addConstraint('client', {
      type: 'FOREIGN KEY',
      fields: ['recordupdateuser_uuid'],
      name: 'client_batsuser_recordupdate_fk',
      references: {
        table: 'batsuser',
        field: 'user_uuid',
      },
    });
    await queryInterface.addIndex('client', {
      fields: ['clientid'],
      unique: true,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('client');
  },
};
