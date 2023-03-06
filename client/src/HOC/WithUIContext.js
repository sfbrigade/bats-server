import React from 'react';
import { UIContextProvider } from '../UIContext';

const withUIContext = (WrappedComponent) => {
  const WithUIContext = ({ ...props }) => {
    return (
      <UIContextProvider>
        <WrappedComponent {...props} />;
      </UIContextProvider>
    );
  };

  return WithUIContext;
};

export default withUIContext;
