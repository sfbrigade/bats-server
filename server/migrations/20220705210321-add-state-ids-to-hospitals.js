module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('hospital', 'hospitalstate', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('hospital', 'hospitalstatefacilitycode', {
      type: Sequelize.STRING,
    });
    await queryInterface.addIndex('hospital', {
      fields: ['hospitalstate', 'hospitalstatefacilitycode'],
      unique: true,
    });
    await queryInterface.sequelize.query(`UPDATE hospital SET hospitalstate='06'`);
    await queryInterface.sequelize.query(`UPDATE hospital SET hospitalstatefacilitycode='20199' WHERE hospitalname='Kaiser SF'`);
    await queryInterface.sequelize.query(`UPDATE hospital SET hospitalstatefacilitycode='20048' WHERE hospitalname='CPMC Davies'`);
    await queryInterface.sequelize.query(`UPDATE hospital SET hospitalstatefacilitycode='62636' WHERE hospitalname='CPMC Van Ness'`);
    await queryInterface.sequelize.query(`UPDATE hospital SET hospitalstatefacilitycode='20050' WHERE hospitalname='Mission Bernal'`);
    await queryInterface.sequelize.query(`UPDATE hospital SET hospitalstatefacilitycode='20386' WHERE hospitalname='SF General'`);
    await queryInterface.sequelize.query(`UPDATE hospital SET hospitalstatefacilitycode='20447' WHERE hospitalname='St. Francis'`);
    await queryInterface.sequelize.query(`UPDATE hospital SET hospitalstatefacilitycode='20462' WHERE hospitalname='St. Mary''s'`);
    await queryInterface.sequelize.query(`UPDATE hospital SET hospitalstatefacilitycode='20065' WHERE hospitalname='Chinese Hospital'`);
    await queryInterface.sequelize.query(`UPDATE hospital SET hospitalstatefacilitycode='20504' WHERE hospitalname='UCSF Parnassus'`);
    await queryInterface.sequelize.query(`UPDATE hospital SET hospitalstatefacilitycode='20540' WHERE hospitalname='VA Med. Center'`);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('hospital', 'hospitalstatefacilitycode');
    await queryInterface.removeColumn('hospital', 'hospitalstate');
  },
};
