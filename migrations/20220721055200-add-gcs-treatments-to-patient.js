/* eslint-disable no-await-in-loop, no-restricted-syntax */
const patient = require('../src/shared/metadata/patient');
const convertToSequelizeField = require('../src/shared/convertToSequelizeField');

const fields = patient.getFieldHash(convertToSequelizeField);
const newFieldNames = ['treatmentNotes', 'glasgowComaScale'];
const { tableName } = patient;

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      for (const name of newFieldNames) {
        const { field, type } = fields[name];

        await queryInterface.addColumn(tableName, field, type, { transaction });
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      for (const name of newFieldNames) {
        const { field } = fields[name];

        await queryInterface.removeColumn(tableName, field, { transaction });
      }
    });
  },
};
