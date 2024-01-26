import React, { createContext, useCallback, useState } from 'react';
import PropTypes from 'prop-types';

const Context = createContext();

function ContextProvider({ children }) {
  const [user, setUser] = useState();
  const [ringdowns, setRingdowns] = useState();
  const [statusUpdates, setStatusUpdates] = useState();
  const [organization, setOrganization] = useState();
  const [hospital, setHospital] = useState();
  const [hospitalUser, setHospitalUser] = useState();

  const setUserAndHospital = useCallback(function (user) {
    setOrganization(user.organization);
    if (user.organization?.type === 'HEALTHCARE') {
      // TODO: handle user added to multiple hospitals
      if (user.activeHospitals?.length > 0) {
        setHospital(user.activeHospitals[0].hospital);
        setHospitalUser(user.activeHospitals[0]);
      }
    }
    setUser(user);
  }, []);

  const value = {
    user,
    setUser: setUserAndHospital,
    ringdowns,
    setRingdowns,
    statusUpdates,
    setStatusUpdates,
    organization,
    setOrganization,
    hospital,
    setHospital,
    hospitalUser,
    setHospitalUser,
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
ContextProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export { ContextProvider };

export default Context;
