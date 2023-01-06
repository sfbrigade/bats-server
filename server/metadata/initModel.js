const convertToSequelizeField = require('./convertToSequelizeField');

module.exports = function initModel(model, metadata, sequelize, options) {
  model.init(metadata.getFieldHash(convertToSequelizeField), {
    sequelize,
    timestamps: true,
    tableName: metadata.tableName,
    modelName: metadata.modelName,
    ...options,
  });

  return model;
};
