const _ = require('lodash');
const { Model } = require('sequelize');
const metadata = require('shared/metadata/massCasualtyIncident');
const initModel = require('../metadata/initModel');

module.exports = (sequelize) => {
  class MassCasualtyIncident extends Model {
    static associate(models) {
      MassCasualtyIncident.belongsTo(models.User, { as: 'CreatedBy' });
      MassCasualtyIncident.belongsTo(models.User, { as: 'UpdatedBy' });
    }

    toJSON() {
      const attributes = { ...this.get() };
      return _.pick(attributes, [
        'id',
        'incidentNumber',
        'address1',
        'address2',
        'city',
        'state',
        'zip',
        'startedAt',
        'endedAt',
        'estimatedRedCount',
        'estimatedYellowCount',
        'estimatedGreenCount',
        'estimatedZebraCount',
        'CreatedById',
        'createdAt',
        'UpdatedById',
        'updatedAt',
      ]);
    }
  }

  initModel(MassCasualtyIncident, metadata, sequelize);

  MassCasualtyIncident.addScope('active', {
    where: {
      endedAt: null,
    },
    order: [
      ['endedAt', 'DESC'],
      ['startedAt', 'DESC'],
    ],
  });

  return MassCasualtyIncident;
};
