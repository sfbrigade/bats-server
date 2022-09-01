const ModelMetadata = require('./ModelMetadata');
const { DeliveryStatus } = require('../constants');

const fields = [
  {
    name: 'id',
    colName: 'patientdelivery_uuid',
    type: 'uuid',
    primaryKey: true,
    autoIncrement: true,
  },
  {
    name: 'AmbulanceId',
    colName: 'ambulance_uuid',
    type: 'uuid',
    allowNull: false,
  },
  {
    name: 'PatientId',
    colName: 'patient_uuid',
    type: 'uuid',
    allowNull: false,
  },
  {
    name: 'HospitalId',
    colName: 'hospital_uuid',
    type: 'uuid',
    allowNull: false,
  },
  {
    name: 'ParamedicUserId',
    colName: 'paramedicuser_uuid',
    type: 'uuid',
    allowNull: false,
  },
  {
    name: 'currentDeliveryStatus',
    type: 'enum',
    enumValues: DeliveryStatus.ALL_STATUSES,
    allowNull: false,
    isParam: true,
  },
  {
    name: 'currentDeliveryStatusDateTimeLocal',
    type: 'date',
    isParam: true,
  },
  {
    name: 'etaMinutes',
    type: 'integer',
    range: { min: 0 },
    isParam: true,
  },
];

module.exports = new ModelMetadata({ modelName: 'PatientDelivery', fields });
