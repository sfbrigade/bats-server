const patient = require('../src/metadata/patient');
const convertToSequelizeField = require('../src/metadata/convertToSequelizeField');

const fields = patient.getFieldHash(convertToSequelizeField);
const newFields = ['treatmentNotes', 'glasgowComaScale'];
const { tableName } = patient;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      for (const fieldName of newFields) {
        const newField = fields[fieldName];

        await queryInterface.addColumn(
          tableName,
          newField.field,
          newField,
          { transaction }
        );
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      for (const fieldName of newFields) {
        const newField = fields[fieldName];

        await queryInterface.removeColumn(tableName, newField.field, { transaction });
      }
    });
  },
};
