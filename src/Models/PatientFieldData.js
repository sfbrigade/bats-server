class PatientFieldData {
  constructor(fieldName, fieldOrder, validationState) {
    this.name = fieldName;
    this.order = fieldOrder;
    this.validationState = validationState;
  }
}

const ValidationState = {
  NO_INPUT: 'NO_INPUT',
  INPUT: 'INPUT',
  ERROR: 'ERROR',
  FIXED: 'FIXED',
};
ValidationState.ALL_STATES = [ValidationState.NO_INPUT, ValidationState.ERROR, ValidationState.FIXED];
Object.freeze(ValidationState);

export { PatientFieldData, ValidationState };
