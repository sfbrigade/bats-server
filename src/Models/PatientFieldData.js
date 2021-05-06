class PatientFieldData {
  constructor(fieldName, fieldOrder, inputState) {
    this.name = fieldName;
    this.order = fieldOrder;
    this.inputState = inputState;
  }
}

const InputState = {
  NO_INPUT: 'NO_INPUT',
  ERROR: 'ERROR',
  FIXED: 'FIXED',
};
Object.freeze(InputState);

export { 
  PatientFieldData,
  InputState
};
