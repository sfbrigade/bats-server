/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('hospital', 'hospital_uk');
    await queryInterface.addConstraint('hospital', {
      name: 'hospital_uk',
      fields: ['healthcareorganization_uuid', 'hospitalname'],
      type: 'UNIQUE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('hospital', 'hospital_uk');
    await queryInterface.addConstraint('hospital', {
      name: 'hospital_uk',
      fields: ['hospitalname'],
      type: 'UNIQUE',
    });
  },
};
