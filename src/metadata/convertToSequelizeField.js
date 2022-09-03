const { DataTypes } = require('sequelize');

const SequelizeKeys = ['allowNull', 'autoIncrement', 'defaultValue', 'get', 'primaryKey', 'set', 'unique', 'validate'];

const pick = (obj, keys) => Object.fromEntries(keys.filter((key) => key in obj).map((key) => [key, obj[key]]));

const getDataType = (typeName) => DataTypes[typeName.toUpperCase()];

module.exports = function convertToSequelizeField(field) {
  const { name, colName, enumValues, virtualArgs, type: typeName } = field;
  const sqlAttributes = pick(field, SequelizeKeys);
  let type = getDataType(typeName);

  if (typeName === 'enum') {
    type = DataTypes.ENUM(enumValues);
  } else if (typeName === 'virtual' && virtualArgs) {
    // eslint-disable-next-line prefer-const
    let [returnType, fields] = virtualArgs;

    if (returnType) {
      returnType = getDataType(returnType);
    }

    type = new DataTypes.VIRTUAL(returnType, fields);
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
