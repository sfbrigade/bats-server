import React, { useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, useRouteMatch } from 'react-router-dom';

import AdminNavigation from '../AdminNavigation';
import ErDashboard from './ErDashboard';
import ErRingdowns from './ErRingdowns';
import ErUsers from './ErUsers';

import ApiService from '../../ApiService';
import Context from '../../Context';

import '../Admin.scss';
import UserInfo from './UserInfo';

export default function AdminER() {
  const [users, setUsers] = useState(null);
  const { user } = useContext(Context);
  const [editProfile, setEditProfile] = useState(false);
  const [ringdowns, setRingdowns] = useState(null);
  const match = useRouteMatch();

  const Back = () => {
    setEditProfile(false);
  };

  const EditMain = () => {
    setEditProfile(true);
  };

  useEffect(() => {
    ApiService.users.all().then((response) => {
      if (users === null) {
        setUsers(response.data);
      }
    });
    ApiService.ringdowns.get(user?.activeHospitals[0].hospital.id).then((response) => {
      if (ringdowns === null) {
        setRingdowns(response.data);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div>
        {editProfile && <UserInfo back={Back} user={user} />}
        <Router>
          <div className="border-bottom border-base-lightest height-15 width-full">
            <AdminNavigation mainUser={user} editMain={EditMain} match={match} />
          </div>
          <div className="admin_body">
            <Switch>
              <Route exact path={`${match.url}/dashboard`}>
                <ErDashboard users={users} mainUser={user} allRingdowns={ringdowns} />
              </Route>
              <Route exact path={`${match.url}/users`}>
                <ErUsers users={users} mainUser={user} />
              </Route>
              <Route exact path={`${match.url}/ringdowns`}>
                <ErRingdowns allRingdowns={ringdowns} />
              </Route>
            </Switch>
          </div>
        </Router>
      </div>
    </div>
  );
}
