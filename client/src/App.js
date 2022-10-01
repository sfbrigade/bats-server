import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

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
          <Switch>
            <Route path="/ems">
              <EMS />
            </Route>
            <Route path="/er">
              <ER />
            </Route>
            <Route path="/admin">
              <Admin />
            </Route>
            <Route exact path="/">
              <Redirect />
            </Route>
          </Switch>
        </Router>
      )}
    </>
  );
}

export default App;
