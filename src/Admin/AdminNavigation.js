import React, { useContext } from 'react';
import { NavLink, useRouteMatch } from 'react-router-dom';

import Context from '../Context';

import './AdminNavigation.scss';

function AdminNavigation() {
  const { url } = useRouteMatch();
  const { user } = useContext(Context);

  const linkStyle = {
    color: '#a9aeb1',
    margin: '0% 6% 0% 0%',
    position: 'relative',
    top: '4rem',
    fontSize: '24px',
  };

  return (
    <div className="margin-y-6 padding-bottom-9">
      <a className="text-base-darkest adminnav_login_logout" href="/auth/local/logout">
        Logout
      </a>
      <div className="adminnav_logo" />
      <h2 className="adminnav_hospital_name">{user ? user.activeHospitals[0].hospital.name : ''}</h2>
      <button type="button" className=" adminnav_edit_profile border-0 border-bottom">
        Edit Profile
      </button>
      <NavLink to={`${url}/dashboard`} style={linkStyle}>
        Dashboard
      </NavLink>
      <NavLink to={`${url}/users`} style={linkStyle}>
        Users
      </NavLink>
      <NavLink to={`${url}/ringdowns`} style={linkStyle}>
        Ringdowns
      </NavLink>
    </div>
  );
}

export default AdminNavigation;
