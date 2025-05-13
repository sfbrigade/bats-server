import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import vh from '@sparing-software/100vh';

import ApiService from './ApiService';
import Context from './Context';
import EMS from './EMS';
import ER from './ER';
import Admin from './Admin';
import Redirect from './Components/Redirect';
import Login from './Auth/Login';
import Forgot from './Auth/Forgot';
import NewPassword from './Auth/NewPassword';
import TwoFactor from './Auth/TwoFactor';
import Invite from './Invites/Invite';
import Venues from './Venues/Venues';

vh.init();

function App() {
  const { user, setUser } = useContext(Context);

  useEffect(() => {
    // hit the users endpoint to ensure authenticated
    ApiService.users
      .me()
      .then((response) => setUser(response.data))
      .catch((err) => {
        if (err === 401) {
          setUser(null);
        }
      });
  }, [setUser]);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/ems/*" element={<EMS />} />
          <Route path="/er/*" element={<ER />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/venues/*" element={<Venues />} />
          {!user && (
            <>
              <Route path="/invites/:id" element={<Invite />} />
              <Route path="/reset" element={<NewPassword />} />
              <Route path="/forgot" element={<Forgot />} />
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
