import React from 'react';
import { BrowserRouter as Router, Switch, Route, useRouteMatch } from 'react-router-dom';

import AdminER from './ER/AdminER';
import AdminEMS from './EMS/AdminEMS';

function Admin() {
  const { path } = useRouteMatch();

  return (
    <Router>
      <Switch>
        <Route path={`${path}/ems`}>
          <AdminEMS />
        </Route>
        <Route path={`${path}/er`}>
          <AdminER />
        </Route>
      </Switch>
    </Router>
  );
}

export default Admin;
