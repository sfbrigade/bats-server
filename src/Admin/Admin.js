import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import Redirect from '../Components/Redirect';
import AdminER from './ER/AdminER';
import AdminEMS from './EMS/AdminEMS';

function Admin() {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/ems`}>
        <AdminEMS />
      </Route>
      <Route path={`${path}/er`}>
        <AdminER />
      </Route>
      <Route exact path={path}>
        <Redirect isAdminOnly />
      </Route>
    </Switch>
  );
}

export default Admin;
