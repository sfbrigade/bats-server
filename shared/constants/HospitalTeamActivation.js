const HospitalTeamActivation = {
  ADULT_TRAUMA: '4224003',
  CARDIAC_ARREST: '4224005',
  GENERAL_TRAUMA: '4224017',
  OBSTETRICS: '4224007',
  PEDIATRIC_TRAUMA: '4224011',
  SEPSIS: '4224019',
  STEMI: '4224013',
  STROKE: '4224015',
  OTHER: '4224009',
};

HospitalTeamActivation.ALL_VALUES = Object.values(HospitalTeamActivation);
HospitalTeamActivation.STRINGS = {
  [HospitalTeamActivation.ADULT_TRAUMA]: 'Adult Trauma',
  [HospitalTeamActivation.CARDIAC_ARREST]: 'Cardiac Arrest',
  [HospitalTeamActivation.GENERAL_TRAUMA]: 'General Trauma',
  [HospitalTeamActivation.OBSTETRICS]: 'Obstetrics',
  [HospitalTeamActivation.PEDIATRIC_TRAUMA]: 'Pediatric Trauma',
  [HospitalTeamActivation.SEPSEIS]: 'Sepsis',
  [HospitalTeamActivation.STEMI]: 'STEMI',
  [HospitalTeamActivation.STROKE]: 'Stroke',
  [HospitalTeamActivation.OTHER]: 'Other',
};

module.exports = Object.freeze(HospitalTeamActivation);
