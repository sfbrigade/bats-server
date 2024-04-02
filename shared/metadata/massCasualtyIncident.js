const ModelMetadata = require('../ModelMetadata');

const fields = [
  {
    name: 'id',
    colName: 'masscasualtyincident_uuid',
    type: 'uuid',
    primaryKey: true,
    autoIncrement: true,
  },
  {
    name: 'incidentNumber',
    type: 'string',
    allowNull: false,
  },
  {
    name: 'address1',
    type: 'string',
  },
  {
    name: 'address2',
    type: 'string',
  },
  {
    name: 'address1',
    type: 'string',
  },
  {
    name: 'city',
    type: 'string',
  },
  {
    name: 'state',
    type: 'string',
  },
  {
    name: 'zip',
    type: 'string',
  },
  {
    name: 'startedAt',
    colName: 'startedattimestamp',
    type: 'date',
    allowNull: false,
  },
  {
    name: 'endedAt',
    colName: 'endedattimestamp',
    type: 'date',
  },
  {
    name: 'estimatedRedCount',
    type: 'integer',
    allowNull: false,
    defaultValue: 0,
  },
  {
    name: 'estimatedYellowCount',
    type: 'integer',
    allowNull: false,
    defaultValue: 0,
  },
  {
    name: 'estimatedGreenCount',
    type: 'integer',
    allowNull: false,
    defaultValue: 0,
  },
  {
    name: 'estimatedZebraCount',
    type: 'integer',
    allowNull: false,
    defaultValue: 0,
  },
];

module.exports = new ModelMetadata({ modelName: 'MassCasualtyIncident', fields });
