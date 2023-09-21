import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import ApiService from './ApiService';
import Context from './Context';
import EMS from './EMS';
import ER from './ER';
import Admin from './Admin';
import Redirect from './Components/Redirect';
import Login from './Auth/Login';
import Reset from './Auth/Reset';
import EmailSent from './Auth/EmailSent';
import NewPassword from './Auth/NewPassword';
import TwoFactor from './Auth/TwoFactor';

function App() {
  const { user, setUser, setOrganization, setHospital, setHospitalUser } = useContext(Context);

  useEffect(() => {
    // hit the users endpoint to ensure authenticated
    ApiService.users
      .me()
      .then((response) => {
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
      })
      .catch((err) => {
        if (err === 401) {
          //set error for unauthorized user
          console.log('you are unauthorized');
        }
      });
  }, [setUser, setOrganization, setHospital, setHospitalUser]);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/ems/*" element={<EMS />} />
          <Route path="/er/*" element={<ER />} />
          <Route path="/admin/*" element={<Admin />} />
          {!user && (
            <>
              <Route path="/reset/newPassword" element={<NewPassword />} />
              <Route path="/reset/emailSent" element={<EmailSent />} />
              <Route path="/reset" element={<Reset />} />
              <Route path="/twoFactor" element={<TwoFactor />} />
              <Route path="/login" element={<Login />} />
            </>
          )}
          <Route path="/" element={<Redirect />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
