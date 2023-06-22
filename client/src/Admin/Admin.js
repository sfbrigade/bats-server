import React from 'react';
import { Switch, Redirect, Route, useRouteMatch } from 'react-router-dom';

import AdminNavigation from './AdminNavigation';
import Dashboard from './Dashboard';
import Ringdowns from './Ringdowns/Ringdowns';
import Users from './Users/Users';
import Hospitals from './Hospitals';
import Settings from './Settings';

export default function Admin() {
  const { path } = useRouteMatch();

  return (
    <>
      <AdminNavigation />
      <div className="grid-container">
        <Switch>
          <Route path={`${path}/dashboard`}>
            <Dashboard />
          </Route>
          <Route path={`${path}/users/:userId?`}>
            <Users />
          </Route>
          <Route path={`${path}/ringdowns`}>
            <Ringdowns />
          </Route>
          <Route path={`${path}/hospitals`}>
            <Hospitals />
          </Route>
          <Route path={`${path}/settings`}>
            <Settings />
          </Route>
          <Route exact path={path}>
            <Redirect to={`${path}/dashboard`} />
          </Route>
        </Switch>
      </div>
    </>
  );
}
