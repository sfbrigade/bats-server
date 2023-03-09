import React from 'react';
import './FormMultiField.scss';

const FormMultiField = ({ label, children }) => {
  return (
    <>
      {label}
      <div className="multi-field">
        {children.map((child) => {
          return (
            <div key={child.props.metadata.name} className="multi-field__input">
              {child}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default FormMultiField;
