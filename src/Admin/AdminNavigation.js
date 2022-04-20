import React, { useContext, useEffect, useState } from 'react';
import { Link, NavLink, useHistory, useRouteMatch } from 'react-router-dom';

import Context from '../Context';

import './AdminNavigation.scss';

function AdminNavigation() {
  const { location } = useHistory();
  const { url } = useRouteMatch();
  const { user } = useContext(Context);
  const [showFlash, setShowFlash] = useState(false);

  useEffect(() => {
    if (location.state?.flash) {
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 2000);
    } else {
      setShowFlash(false);
    }
  }, [location]);

  return (
    <div className="admin-navigation">
      <div className="admin-navigation__container grid-container">
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
          {/* <NavLink to={`${url}/ringdowns`} className="admin-navigation__link" activeClassName="admin-navigation__link--active">
            Ringdowns
          </NavLink> */}
        </div>
        {showFlash && location.state?.flash?.info && (
          <div className="admin-navigation__alert usa-alert usa-alert--success usa-alert--slim usa-alert--no-icon">
            <div className="usa-alert__body">
              <p className="usa-alert__text">{location.state.flash.info}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminNavigation;
