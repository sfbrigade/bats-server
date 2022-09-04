const Suffixes = {
  uuid: '_uuid',
  enum: 'enum',
};
const NonParamTypes = ['uuid', 'date'];

function createColName({ name, type }) {
  return name.toLowerCase() + (Suffixes[type] || '');
}

class FieldMetadata {
  constructor(field) {
    Object.assign(
      this,
      // assign these default values first so the field can override them below
      {
        colName: createColName(field),
        isParam: !NonParamTypes.includes(field.type),
        defaultValue: field.defaultValue ?? field.type === 'boolean' ? false : null,
      },
      field
    );
  }

  toString() {
    return `FieldMetadata: ${this.name}`;
  }

  get [Symbol.toStringTag]() {
    return this.toString();
  }
}

module.exports = FieldMetadata;
