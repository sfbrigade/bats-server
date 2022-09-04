const ModelMetadata = require('../ModelMetadata');

const fields = [
  {
    name: 'id',
    colName: 'emergencymedicalservicecall_uuid',
    type: 'uuid',
    primaryKey: true,
    autoIncrement: true,
  },
  {
    name: 'dispatchCallNumber',
    type: 'integer',
    allowNull: false,
  },
  {
    name: 'startDateTimeLocal',
    type: 'date',
    allowNull: false,
  },
];

module.exports = new ModelMetadata({ modelName: 'EmergencyMedicalServiceCall', fields });
