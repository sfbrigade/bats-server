const FieldMetadata = require('./FieldMetadata');

const identity = (field) => [field.name, field];

class ModelMetadata {
  constructor({ modelName, tableName = modelName.toLowerCase(), fields }) {
    this.modelName = modelName;
    this.tableName = tableName;
    this.fields = Object.freeze(fields.map((field) => new FieldMetadata(field)));
    this.params = Object.freeze(this.fields.filter(({ isParam }) => isParam).map(({ name }) => name));
  }

  getFieldHash(convertField = identity) {
    return this.fields.reduce((result, field) => {
      const [name, convertedField] = convertField(field);

      if (name && convertedField) {
        result[name] = convertedField;
      }

      return result;
    }, {});
  }

  getParams() {
    return this.params;
  }

  getObjectFields() {
    return this.fields.filter(({ type, isParam }) => isParam || type === 'enum');
  }
}

module.exports = ModelMetadata;
