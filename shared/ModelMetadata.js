const FieldMetadata = require('./FieldMetadata');

const identity = (field) => field;
const keyValue = (field) => [field.name, field];
const all = () => true;

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
    this.params = Object.freeze(
      this.getFields(
        ({ name }) => name,
        ({ isParam }) => isParam
      )
    );
  }

  getFields(convertField = identity, filter = all) {
    return this.fields.filter(filter).map(convertField);
  }

  getFieldHash(convertField = keyValue, filter = all) {
    console.log('Object.fromEntries(this.getFields(convertField, filter))', Object.fromEntries(this.getFields(convertField, filter)));
    return Object.fromEntries(this.getFields(convertField, filter));
  }

  getParams() {
    return this.params;
  }

  getObjectFields() {
    return this.getFields(undefined, ({ type, isParam }) => isParam || type === 'enum');
  }
}

module.exports = ModelMetadata;
