const { Model } = require('sequelize');
const metadata = require('shared/metadata/assignment');
const initModel = require('../metadata/initModel');

module.exports = (sequelize) => {
  class Assignment extends Model {
    static associate(models) {
      Assignment.belongsTo(models.Organization, { as: 'FromOrganization' });
      Assignment.belongsTo(models.Organization, { as: 'ToOrganization' });

      Assignment.belongsTo(models.User, { as: 'CreatedBy' });
      Assignment.belongsTo(models.User, { as: 'DeletedBy' });
      Assignment.belongsTo(models.User, { as: 'UpdatedBy' });
    }
  }

  initModel(Assignment, metadata, sequelize);

  Assignment.addScope('defaultScope', {
    where: {
      deletedAt: null,
    },
  });

  return Assignment;
};
