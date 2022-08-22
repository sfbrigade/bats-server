import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { ValidationState } from '../Models/PatientFieldData';
import ValidationMessage from './ValidationMessage';

import './FormRadioFieldSet.scss';

function FormRadioFieldSet({ children, label, property, value, required, validationState, onChange }) {
  const radioButtons = children.map((child) => {
    const {
      props: { value: childValue },
    } = child;

    return React.cloneElement(child, {
      key: childValue,
      name: property,
      checked: childValue === value,
      onChange,
    });
  });

  return (
    <fieldset
      className={classNames('usa-fieldset form-radio-field-set', {
        'form-radio-field-set--error': validationState === ValidationState.ERROR,
      })}
    >
      <div className="form-radio-field-set__background">
        {label && (
          <label className={classNames('usa-label', { 'usa-label--required': required })} htmlFor={property}>
            {label}
          </label>
        )}
        {radioButtons}
        <ValidationMessage className="margin-top-1" validationState={validationState} />
      </div>
    </fieldset>
  );
}

FormRadioFieldSet.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  property: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.node,
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.number, PropTypes.string]),
  required: PropTypes.bool,
  validationState: PropTypes.string,
};

FormRadioFieldSet.defaultProps = {
  label: null,
  value: null,
  required: false,
  validationState: ValidityState.NO_INPUT,
};

export default FormRadioFieldSet;
