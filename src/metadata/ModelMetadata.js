const FieldMetadata = require('./FieldMetadata');

const identity = (field) => [field.name, field];

const createdUpdatedFields = [
  {
    name: 'createdAt',
    colName: 'recordcreatetimestamp',
    type: 'date',
  },
  {
    name: 'CreatedById',
    colName: 'recordcreateuser_uuid',
    type: 'uuid',
  },
  {
    name: 'updatedAt',
    colName: 'recordupdatetimestamp',
    type: 'date',
  },
  {
    name: 'UpdatedById',
    colName: 'recordupdateuser_uuid',
    type: 'uuid',
  },
];

class ModelMetadata {
  constructor({ modelName, tableName = modelName.toLowerCase(), fields }) {
    this.modelName = modelName;
    this.tableName = tableName;
    // append the standard created and updated fields to all models
    this.fields = Object.freeze([...fields, ...createdUpdatedFields].map((field) => new FieldMetadata(field)));
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
