/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('masscasualtyincident', {
      masscasualtyincident_uuid: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      incidentnumber: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      address1: {
        type: Sequelize.STRING,
      },
      address2: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      state: {
        type: Sequelize.STRING,
      },
      zip: {
        type: Sequelize.STRING,
      },
      startedattimestamp: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      endedattimestamp: {
        type: Sequelize.DATE,
      },
      estimatedredcount: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      estimatedyellowcount: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      estimatedgreencount: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      estimatedzebracount: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
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
    await queryInterface.addConstraint('masscasualtyincident', {
      type: 'PRIMARY KEY',
      fields: ['masscasualtyincident_uuid'],
      name: 'masscasualtyincident_pk',
    });
    await queryInterface.addConstraint('masscasualtyincident', {
      type: 'FOREIGN KEY',
      fields: ['recordcreateuser_uuid'],
      name: 'masscasualtyincident_batsuser_fk',
      references: {
        table: 'batsuser',
        field: 'user_uuid',
      },
    });
    await queryInterface.addConstraint('masscasualtyincident', {
      type: 'FOREIGN KEY',
      fields: ['recordupdateuser_uuid'],
      name: 'masscasualtyincident_batsuser_recordupdate_fk',
      references: {
        table: 'batsuser',
        field: 'user_uuid',
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('masscasualtyincident');
  },
};
