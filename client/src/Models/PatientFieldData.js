class PatientFieldData {
  constructor(fieldName, fieldOrder, validationState) {
    this.name = fieldName;
    this.order = fieldOrder;
    this.validationState = validationState;
  }
}

const ValidationState = {
  EMPTY_INPUT: 'EMPTY_INPUT',
  INPUT: 'INPUT',
  RANGE_ERROR: 'RANGE_ERROR',
  REQUIRED_INPUT: 'REQUIRED_INPUT',
  EMPTY_REQUIRED_INPUT: 'EMPTY_REQUIRED_INPUT',
  REQUIRED_ERROR: 'REQUIRED_ERROR',
};
ValidationState.ALL_STATES = [
  ValidationState.EMPTY_INPUT,
  ValidationState.INPUT,
  ValidationState.REQUIRED_ERROR,
  ValidationState.RANGE_ERROR,
  ValidationState.REQUIRED_INPUT,
  ValidationState.EMPTY_REQUIRED_INPUT,
];
Object.freeze(ValidationState);

export { PatientFieldData, ValidationState };
