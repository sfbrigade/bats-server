const { DataTypes } = require('sequelize');

const SequelizeKeys = ['allowNull', 'autoIncrement', 'defaultValue', 'get', 'primaryKey', 'set', 'unique', 'validate'];

const pick = (obj, keys) => Object.fromEntries(keys.filter((key) => key in obj).map((key) => [key, obj[key]]));

const getDataType = (typeName) => DataTypes[typeName.toUpperCase()];

module.exports = function convertToSequelizeField(field) {
  const { name, colName, typeArgs, type: typeName } = field;
  const sqlAttributes = pick(field, SequelizeKeys);
  let type = getDataType(typeName);

  if (typeName === 'enum') {
    type = new DataTypes.ENUM(typeArgs);
  } else if (typeName === 'virtual' && typeArgs) {
    const [returnType, fields] = typeArgs;

    type = new DataTypes.VIRTUAL(returnType && getDataType(returnType), fields);
  }

  // virtual fields don't have a column name in the db
  if (typeName !== 'virtual') {
    sqlAttributes.field = colName;
  }

  const convertedField = {
    type,
    ...sqlAttributes,
  };

  return [name, convertedField];
};
