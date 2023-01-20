import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { ValidationState } from '../Models/PatientFieldData';

function ValidationMessage({ className, validationState, errorString }) {
  const errorHtml = (
    <div className={classNames('usa-error-message', className)}>
      <i className="fas fa-exclamation-circle" /> {errorString || `This is a required field`}
    </div>
  );

  if (errorString || validationState === ValidationState.ERROR) {
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
