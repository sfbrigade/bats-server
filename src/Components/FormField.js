/* eslint-disable react/jsx-props-no-spreading, react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import FormCheckbox from './FormCheckbox';
import FormInput from './FormInput';
import FormTextArea from './FormTextArea';
import { useForm } from './Form';

export default function FormField({ metadata, ...props }) {
  const { data, onChange } = useForm();
  const { name: property, type, label, required } = metadata;
  const value = data[property];
  const commonProps = {
    property,
    label,
    value,
    required,
    onChange,
    validationState: data.getValidationState(property)
  };

	switch (type) {
    case 'integer':
    case 'decimal': {
      const { unit = metadata.unit, range = metadata.range, size = 'small' } = props;
      const { min, max } = range || {};

      return (
        <FormInput
          {...commonProps}
          unit={unit}
          min={min}
          max={max}
          size={size}
          type="number"
          {...props}
        />
      );
    }

    case 'boolean':
      return (
        <FormCheckbox
          {...commonProps}
          currentValue={value}
          value={true}
          {...props}
        />
      );

    case 'text':
      return (
        <FormTextArea
          {...commonProps}
          {...props}
        />
      );

    default:
      throw new Error(`Unknown field type: ${type}`);
  }
}

FormField.propTypes = {
  metadata: PropTypes.object.isRequired,
};
