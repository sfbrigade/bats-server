import React from 'react';
import PropTypes from 'prop-types';
import { ValidationState } from '../Models/PatientFieldData';

const ValidationMessage = ({ validationState }) => {
  const errorHtml = (
    <div className="usa-error-message margin-top-1">
      <i className="fas fa-exclamation-circle" /> This is a required section
    </div>
  );
  const successHtml = (
    <div className="usa-success-message margin-top-1">
      <i className="fas fa-check-circle" /> Success
    </div>
  );

  if (validationState === ValidationState.ERROR) {
    return errorHtml;
  }
  if (validationState === ValidationState.FIXED) {
    return successHtml;
  }
  return <></>;
};

ValidationMessage.propTypes = {
  validationState: PropTypes.oneOfType([...ValidationState.ALL_STATES]),
};

ValidationMessage.defaultProps = {
  validationState: ValidationState.NO_INPUT,
};

export default ValidationMessage;
