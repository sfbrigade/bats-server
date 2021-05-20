import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { ValidationState } from '../Models/PatientFieldData';
import ValidationMessage from './ValidationMessage';

import './FormRadioFieldSet.scss';

function FormRadioFieldSet({ formRadios, labelText, property, isRequired, validationState }) {
  return (
    <fieldset
      className={classNames('usa-fieldset padding-top-neg-8', {
        'form-radio-field-set__error': validationState === ValidationState.ERROR,
        'form-radio-field-set__success': validationState === ValidationState.FIXED,
      })}
    >
      <div role="alert">
        <label className={classNames('usa-label', { 'usa-label--required': isRequired })} htmlFor={property}>
          {labelText}
        </label>
        {formRadios}
      </div>
      <div className="margin-bottom-2">
        <ValidationMessage validationState={validationState} />
      </div>
    </fieldset>
  );
}

FormRadioFieldSet.propTypes = {
  formRadios: PropTypes.arrayOf(PropTypes.elementType).isRequired,
  labelText: PropTypes.string.isRequired,
  property: PropTypes.string.isRequired,
  isRequired: PropTypes.bool.isRequired,
  validationState: PropTypes.string,
};

FormRadioFieldSet.defaultProps = {
  validationState: ValidityState.NO_INPUT,
};

export default FormRadioFieldSet;
