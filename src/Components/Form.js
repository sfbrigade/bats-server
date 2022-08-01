import React, { useMemo, useContext, createContext } from 'react';

const FormContext = createContext(undefined);

const Form = ({ data, onChange, children, ...props }) => {
  const context = useMemo(() => ({
    data,
    onChange
  }), [data, onChange]);

  // we spread the extra props on the form so the caller can apply classes and other properties to
  // the form element
  return (
    <FormContext.Provider value={context}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <form {...props}>
        {children}
      </form>
    </FormContext.Provider>
  );
};

const useForm = () => {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error('useForm() must be used within a Form.');
  }

  return context;
};

export default Form;

export {
  useForm,
};
