import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import ApiService from './ApiService';
import Context from './Context';
import EMS from './EMS';
import ER from './ER';
import AdminER from './Admin/AdminER/Admin';
import AdminEMS from './Admin/AdminEMS/Admin';
import Redirect from './Components/Redirect';

function App() {
  const { setUser, setHospital } = useContext(Context);

  useEffect(() => {
    // hit the users endpoint to ensure authenticated
    ApiService.users.me().then((response) => {
      // save the user data into the context
      const user = response.data;
      setUser(user);
      if (user.organization.type === 'HEALTHCARE') {
        // TODO: handle user added to multiple hospitals
        setHospital(user.activeHospitals[0]);
      }
    });
  }, [setUser, setHospital]);

  return (
    <Router>
      <Switch>
        <Route path="/ems">
          <EMS />
        </Route>
        <Route path="/er">
          <ER />
        </Route>
        {/* create two paths for ER and EMS admin functions */}
        <Route path="/admin/ems">
          <AdminEMS />
        </Route>
        <Route path="/admin/er">
          <AdminER />
        </Route>
        <Route exact path="/">
          <Redirect />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
