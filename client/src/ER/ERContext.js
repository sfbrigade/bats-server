import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

const ERContext = createContext();

function ERContextProvider({ children }) {
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
  return <ERContext.Provider value={value}>{children}</ERContext.Provider>;
}
ERContextProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export { ERContextProvider };

export default ERContext;
