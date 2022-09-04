const ModelMetadata = require('./ModelMetadata');

const fields = [
  {
    name: 'id',
    colName: 'emergencymedicalservicecallambulance_uuid',
    type: 'uuid',
    primaryKey: true,
    autoIncrement: true,
  },
  {
    name: 'EmergencyMedicalServiceCallId',
    colName: 'emergencymedicalservicecall_uuid',
    type: 'uuid',
  },
  {
    name: 'AmbulanceId',
    colName: 'ambulance_uuid',
    type: 'uuid',
  },
  {
    name: 'startDateTimeLocal',
    type: 'date',
    allowNull: false,
  },
];

module.exports = new ModelMetadata({ modelName: 'EmergencyMedicalServiceCallAmbulance', fields });
