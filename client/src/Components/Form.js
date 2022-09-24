import React, { useMemo, useContext, createContext } from 'react';
import PropTypes from 'prop-types';

const ignoreEnterKey = (e) => e.preventDefault();

const FormContext = createContext(undefined);

const Form = ({ data, onChange, children, ...props }) => {
  const context = useMemo(
    () => ({
      data,
      onChange,
    }),
    [data, onChange]
  );

  // we spread the extra props on the form so the caller can apply classes and other properties to
  // the form element
  return (
    <FormContext.Provider value={context}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <form {...props}>{children}</form>
    </FormContext.Provider>
  );
};

Form.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  children: PropTypes.node,
};

Form.defaultProps = {
  onChange: null,
  // by default, prevent pressing enter on an input from submitting the form
  onSubmit: ignoreEnterKey,
  children: null,
};

const useForm = () => {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error('useForm() must be used within a Form.');
  }

  return context;
};

export default Form;

export { useForm };
