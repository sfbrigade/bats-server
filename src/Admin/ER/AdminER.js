import React, { useContext, useState, useEffect } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import AdminNavigation from '../AdminNavigation';
import ErDashboard from './ErDashboard';
import ErRingdowns from './ErRingdowns';
import ErUsers from './ErUsers';

import ApiService from '../../ApiService';
import Context from '../../Context';

import '../Admin.scss';

export default function AdminER() {
  const { path } = useRouteMatch();
  const { user } = useContext(Context);

  const [users, setUsers] = useState([]);
  const [ringdowns, setRingdowns] = useState([]);

  useEffect(() => {
    if (user) {
      // remove api calls and create reusable component
      ApiService.users.all().then((response) => {
        setUsers(response.data);
      });
      ApiService.ringdowns.get(user?.activeHospitals[0].hospital.id).then((response) => {
        setRingdowns(response.data);
      });
    }
  }, [user]);

  return (
    <>
      <AdminNavigation />
      <div className="grid-container">
        <Switch>
          <Route path={`${path}/dashboard`}>
            <ErDashboard users={users} allRingdowns={ringdowns} />
          </Route>
          <Route path={`${path}/users`}>
            <ErUsers users={users} />
          </Route>
          <Route path={`${path}/ringdowns`}>
            <ErRingdowns allRingdowns={ringdowns} />
          </Route>
        </Switch>
      </div>
    </>
  );
}
