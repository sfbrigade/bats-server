import React, { useContext } from 'react';
import { Link, NavLink, useRouteMatch } from 'react-router-dom';

import Context from '../Context';

import './AdminNavigation.scss';

function AdminNavigation() {
  const { url } = useRouteMatch();
  const { user } = useContext(Context);

  return (
    <div className="admin-navigation">
      <div className="grid-container">
        <div className="display-flex flex-row flex-justify">
          <div>
            <h2 className="admin-navigation__hospital-name">{user?.activeHospitals?.[0]?.hospital?.name}</h2>
            <Link to={`/users/${user?.id}`}>Edit Profile</Link>
          </div>
          <div>
            <a className="admin-navigation__logout" href="/auth/local/logout">
              Logout
            </a>
          </div>
        </div>
        <div className="display-flex flex-row flex-justify-center">
          <NavLink to={`${url}/dashboard`} className="admin-navigation__link" activeClassName="admin-navigation__link--active">
            Dashboard
          </NavLink>
          <NavLink to={`${url}/users`} className="admin-navigation__link" activeClassName="admin-navigation__link--active">
            Users
          </NavLink>
          <NavLink to={`${url}/ringdowns`} className="admin-navigation__link" activeClassName="admin-navigation__link--active">
            Ringdowns
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default AdminNavigation;
