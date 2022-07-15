const { DataTypes } = require('sequelize');

const Suffixes = {
  [DataTypes.UUID]: '_uuid',
  [DataTypes.ENUM]: 'enum',
};

function createColName({ name, colName, type }){
  if (colName) {
    return colName;
  }

  return name.toLowerCase() + (Suffixes[type] || '');
}

function createParams(fields) {
  const params = [];

  fields.forEach(({ name, type }) => {
    if (type !== DataTypes.UUID && type !== DataTypes.DATE) {
      params.push(name);
    }
  });

  return Object.freeze(params);
}

class Metadata {
  constructor(fields)
  {
    this.fields = Object.freeze(fields.map((field) => {
      field.colName = createColName(field);

      return field;
    }));
    this.params = createParams(this.fields);
  }

  getFieldHash() {
    const hash = {};

    this.fields.forEach(({ name, colName: field, ...rest }) => {
    	hash[name] = { field, ... rest };
    });

    return hash;
  }

  getParams() {
    return this.params;
  }
}

module.exports = Metadata;
