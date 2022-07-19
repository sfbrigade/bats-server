const Suffixes = {
  'uuid': '_uuid',
  'enum': 'enum',
};
const NonParamTypes = [
  'uuid',
  'date'
];

function createColName({ name, type }){
  return name.toLowerCase() + (Suffixes[type] || '');
}

class FieldMetadata {
  constructor(field) {
    Object.assign(
      this,
      {
        colName: createColName(field),
        isParam: !NonParamTypes.includes(field.type),
        defaultValue: field.defaultValue ??
          field.type === 'boolean'
            ? false
            : null
      },
      field
    );
  }
}

module.exports = FieldMetadata;
