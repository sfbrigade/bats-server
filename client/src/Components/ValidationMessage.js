import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { ValidationState } from '../Models/PatientFieldData';

function ValidationMessage({ className, validationState, min, max }) {
  const errorMessage = validationState === ValidationState.RANGE_ERROR ? `Range: ${min} - ${max}` : `This is a required field`;
  const errorHtml = (
    <div className={classNames('usa-error-message', className)}>
      <i className="fas fa-exclamation-circle" /> {errorMessage}
    </div>
  );

  if (validationState === ValidationState.RANGE_ERROR || validationState === ValidationState.REQUIRED_ERROR) {
    return errorHtml;
  }

  return null;
}

ValidationMessage.propTypes = {
  className: PropTypes.string,
  validationState: PropTypes.oneOf([...ValidationState.ALL_STATES]),
};

ValidationMessage.defaultProps = {
  className: undefined,
  validationState: ValidationState.NO_INPUT,
};

export default ValidationMessage;
