import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { ValidationState } from '../Models/PatientFieldData';
import ValidationMessage from './ValidationMessage';

import './FormRadioFieldSet.scss';

function FormRadioFieldSet({ children, labelText, property, isRequired, validationState }) {
  return (
    <fieldset
      className={classNames('usa-fieldset form-radio-field-set', {
        'form-radio-field-set--error': validationState === ValidationState.ERROR,
      })}
    >
      <div className="form-radio-field-set__background">
        <label className={classNames('usa-label', { 'usa-label--required': isRequired })} htmlFor={property}>
          {labelText}
        </label>
        {children}
        <ValidationMessage className="margin-top-1" validationState={validationState} />
      </div>
    </fieldset>
  );
}

FormRadioFieldSet.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  labelText: PropTypes.string.isRequired,
  property: PropTypes.string.isRequired,
  isRequired: PropTypes.bool.isRequired,
  validationState: PropTypes.string,
};

FormRadioFieldSet.defaultProps = {
  validationState: ValidityState.NO_INPUT,
};

export default FormRadioFieldSet;
