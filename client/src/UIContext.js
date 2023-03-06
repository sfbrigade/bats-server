import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

const UIContext = createContext();

function UIContextProvider({ children }) {
  const [ringdownSections, setRingdownSections] = useState({
    waiting: {
      expanded: true,
    },
    enroute: {
      expanded: true,
    },
  });

  const value = {
    ringdownSections,
    setRingdownSections,
  };
  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}
UIContextProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export { UIContextProvider };

export default UIContext;
