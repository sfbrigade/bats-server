import React, { useMemo, useContext, createContext } from 'react';

const FormContext = createContext(undefined);

const Form = ({ data, onChange, children }) => {
  const context = useMemo(() => ({
    data,
    onChange
  }), [data, onChange]);

  return (
    <FormContext.Provider value={context}>
      {children}
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

export {
  Form,
  useForm,
};
