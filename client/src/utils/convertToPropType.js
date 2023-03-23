import PropTypes from 'prop-types';

const PropTypeLookup = {
  text: 'string',
  integer: 'number',
  decimal: 'number',
  boolean: 'bool',
};

export function convertToPropType(field) {
  const { name, type, isParam, typeArgs, required } = field;
  // if the field isn't something we want to convert to a propType, then return an empty array so
  // getFieldHash() won't include this field
  let result = [];

  if (isParam || type === 'enum') {
    const reactType = PropTypeLookup[type];
    let propType = PropTypes[reactType];

    if (type === 'enum') {
      propType = PropTypes.oneOf(typeArgs);
    }

    if (required) {
      propType = propType.isRequired;
    }

    result = [name, propType];
  }

  return result;
}
