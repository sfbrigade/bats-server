import React from 'react';
import { Switch, Redirect, Route, useRouteMatch } from 'react-router-dom';

import AdminNavigation from './AdminNavigation';
import Dashboard from './Dashboard';
import Ringdowns from './Ringdowns/Ringdowns';
import Users from './Users/Users';

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
          <Route exact path={path}>
            <Redirect to={`${path}/dashboard`} />
          </Route>
        </Switch>
      </div>
    </>
  );
}
