const PropTypes = require('prop-types');

const PropTypeLookup = {
  text: 'string',
  integer: 'number',
  decimal: 'number',
  boolean: 'bool',
};

module.exports = function convertToPropType(field) {
  const { name, type, isParam, enumValues, required } = field;
  // if the field isn't something we want to convert to a propType, then return an empty array so
  // getFieldHash() won't include this field
  let result = [];

  if (isParam || type === 'enum') {
    const reactType = PropTypeLookup[type];
    let propType = PropTypes[reactType];

    if (type === 'enum') {
      propType = PropTypes.oneOf(enumValues);
    }

    if (required) {
      propType = propType.isRequired;
    }

    result = [name, propType];
  }

  return result;
};
