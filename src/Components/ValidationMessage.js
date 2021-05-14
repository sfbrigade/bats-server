import React from 'react';
import PropTypes from 'prop-types';
import { ValidationState } from '../Models/PatientFieldData';

const ValidationMessage = ({ validationState }) => {
  const errorHtml = (
    <span className="usa-error-message">
      <i className="fas fa-exclamation-circle" /> This is a required section
    </span>
  );
  const successHtml = (
    <span className="usa-success-message">
      <i className="fas fa-check-circle" /> Success
    </span>
  );
  if (validationState === ValidationState.ERROR) {
    return errorHtml;
  }
  if (validationState === ValidationState.FIXED) {
    return successHtml;
  }
  return <span />;
};

ValidationMessage.propTypes = {
  validationState: PropTypes.oneOfType([...ValidationState.ALL_STATES]),
};
ValidationMessage.defaultProps = {
  validationState: ValidationState.NO_INPUT,
};

export default ValidationMessage;
