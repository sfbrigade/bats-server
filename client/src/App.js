import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import ApiService from './ApiService';
import Context from './Context';
import EMS from './EMS';
import ER from './ER';
import Admin from './Admin';
import Redirect from './Components/Redirect';
import Spinner from './Components/Spinner';

function App() {
  const { user, setUser, setOrganization, setHospital, setHospitalUser } = useContext(Context);

  useEffect(() => {
    // hit the users endpoint to ensure authenticated
    ApiService.users.me().then((response) => {
      // save the user data into the context
      const user = response.data;
      setOrganization(user.organization);
      if (user.organization?.type === 'HEALTHCARE') {
        // TODO: handle user added to multiple hospitals
        if (user.activeHospitals?.length > 0) {
          setHospital(user.activeHospitals[0].hospital);
          setHospitalUser(user.activeHospitals[0]);
        }
      }
      setUser(user);
    });
  }, [setUser, setOrganization, setHospital, setHospitalUser]);

  return (
    <>
      {!user && (
        <div className="padding-9">
          <Spinner />
        </div>
      )}
      {user && (
        <Router>
          <Routes>
            <Route path="/ems/*" element={<EMS />} />
            <Route path="/er/*" element={<ER />} />
            <Route path="/admin/*" element={<Admin />} />
            <Route path="/" element={<Redirect />} />
          </Routes>
        </Router>
      )}
    </>
  );
}

export default App;
