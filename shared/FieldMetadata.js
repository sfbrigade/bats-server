const Suffixes = {
  uuid: '_uuid',
  enum: 'enum',
};
const NonParamTypes = ['uuid', 'date'];
const UUIDPattern = /[-a-f0-9]+/i;

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

  valueFromString(string) {
    let value;

    switch (this.type) {
      case 'uuid':
        value = UUIDPattern.test(string) ? string : undefined;
        break;

      case 'integer':
      case 'decimal':
        value = Number(string);
        break;

      case 'boolean':
        value = Boolean(string);
        break;

      case 'enum':
        value = this.typeArgs.includes(string) ? string : undefined;
        break;

      case 'text':
      case 'string':
        value = string;
        break;

      default:
        value = undefined;
        break;
    }

    return value;
  }

  toString() {
    return `FieldMetadata: ${this.name}`;
  }

  get [Symbol.toStringTag]() {
    return this.toString();
  }
}

module.exports = FieldMetadata;
