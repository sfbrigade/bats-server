"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert("batsuser", [
      {
        user_uuid: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        firstname: "Jane",
        lastname: "Doe",
        email: "jane@example.com",
        subjectid: "foo",
        rolename: "test",
        hashedpassword:
          "$2b$10$MQER6j8rgSQhkFPRqEHa8uMuD1omFVErgj5965sukZykNvcynV2Jq",
        recordcreatetimestamp:"2001-09-29 00:00:00",
        recordupdatetimestamp:"2001-09-29 00:00:00",
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("batsuser", {
      where: { email: "jane@example.com" },
    });
  },
};
