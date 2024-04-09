const ambulance = require('./ambulance');
const emergencyMedicalServiceCall = require('./emergencyMedicalServiceCall');
const emergencyMedicalServiceCallAmbulance = require('./emergencyMedicalServiceCallAmbulance');
const hospital = require('./hospital');
const hospitalStatusUpdate = require('./hospitalStatusUpdate');
const hospitalUser = require('./hospitalUser');
const massCasualtyIncident = require('./massCasualtyIncident');
const organization = require('./organization');
const patient = require('./patient');
const patientDeliveryUpdate = require('./patientDeliveryUpdate');
const patientDelivery = require('./patientDelivery');
const user = require('./user');

module.exports = {
  ambulance,
  emergencyMedicalServiceCall,
  emergencyMedicalServiceCallAmbulance,
  hospital,
  hospitalStatusUpdate,
  hospitalUser,
  massCasualtyIncident,
  organization,
  patient,
  patientDelivery,
  patientDeliveryUpdate,
  user,
};
