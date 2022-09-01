const { DataTypes } = require('sequelize');

const SequelizeKeys = ['allowNull', 'autoIncrement', 'defaultValue', 'primaryKey', 'unique'];

const pick = (obj, keys) => Object.fromEntries(keys.filter((key) => key in obj).map((key) => [key, obj[key]]));

module.exports = function convertToSequelizeField(field) {
  const { name, type: typeName, enumValues } = field;

  let type = DataTypes[typeName.toUpperCase()];

  if (typeName === 'enum') {
    type = DataTypes.ENUM(enumValues);
  }

  const convertedField = {
    field: field.colName,
    type,
    ...pick(field, SequelizeKeys),
  };

  return [name, convertedField];
};
