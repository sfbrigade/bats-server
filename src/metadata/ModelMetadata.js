const FieldMetadata = require('./FieldMetadata');

const PropTypeLookup = {
  text: 'string',
  integer: 'number',
  decimal: 'number',
  boolean: 'bool',
};

const identity = (field) => [field.name, field];

function createParamsList(fields) {
  const params = fields.filter(({ isParam }) => isParam).map(({ name }) => name);

  return Object.freeze(params);
}

class ModelMetadata {
  constructor(fields) {
    this.fields = Object.freeze(fields.map((field) => new FieldMetadata(field)));
    this.params = createParamsList(this.fields);
  }

  getFieldHash(convertField = identity) {
    const hash = {};

    this.fields.forEach((field) => {
      const [name, convertedField] = convertField(field);

      hash[name] = convertedField;
    });

    return hash;
  }

  getParams() {
    return this.params;
  }

  getObjectFields() {
    return this.fields.filter(({ type, isParam }) => isParam || type === 'enum');
  }

  getPropTypes(PropTypes) {
    return this.getObjectFields().reduce((result, field) => {
      const { name, type, enumValues, required } = field;
      const reactType = PropTypeLookup[type];
      let propType = PropTypes[reactType];

      if (type === 'enum') {
        propType = PropTypes.oneOf(enumValues);
      }

      if (required) {
        propType = propType.isRequired;
      }

      result[name] = propType;

      return result;
    }, {});
  }
}

module.exports = ModelMetadata;
