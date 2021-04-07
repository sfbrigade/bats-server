import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

const Context = createContext();

function ContextProvider({ children }) {
  const [user, setUser] = useState();
  const [ringdowns, setRingdowns] = useState();
  const [statusUpdates, setStatusUpdates] = useState();
  const [hospital, setHospital] = useState();

  return (
    <Context.Provider value={{ user, setUser, ringdowns, setRingdowns, statusUpdates, setStatusUpdates, hospital, setHospital }}>
      {children}
    </Context.Provider>
  );
}
ContextProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export { ContextProvider };

export default Context;
