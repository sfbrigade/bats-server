/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('patient', 'triagetag', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('patient', 'triagepriority', {
      type: Sequelize.STRING,
    });
    await queryInterface.sequelize.query(`CREATE TYPE triageprioritytype AS ENUM ('RED', 'YELLOW', 'GREEN')`);
    await queryInterface.sequelize.query(`
      ALTER TABLE patient 
      ALTER COLUMN triagepriority TYPE triageprioritytype 
      USING triagepriority::triageprioritytype;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('patient', 'triagetag');
    await queryInterface.removeColumn('patient', 'triagepriority');
    await queryInterface.sequelize.query(`DROP TYPE triageprioritytype`);
  },
};
