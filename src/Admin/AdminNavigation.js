import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from "react-router-dom";

import './AdminNavigation.scss';

export default function AdminNavigation({ mainUser, editMain, match }) {
  const linkStyle = {
    color: '#a9aeb1',
    margin: '0% 6% 0% 0%',
    position: 'relative',
    top: '4rem',
    fontSize: '24px',
  };
  const linkStyle_not_current = {
    color: '#005EA2'
  };
  return (
    <div className="margin-y-6 padding-bottom-9">
        <a className="text-base-darkest adminnav_login_logout" href="/auth/local/logout">
          Logout
        </a>
          <div className="adminnav_logo" />
          <h2 className="adminnav_hospital_name">{mainUser ? mainUser.activeHospitals[0].hospital.name : ''}</h2>
          <button 
          type="button" 
          className=" adminnav_edit_profile border-0 border-bottom"
          onClick={() => editMain()}
          >
            Edit Profile
          </button>
        
        <NavLink 
          to={`${match.url}dashboard`} 
          style={linkStyle}
        >
          Dashboard
          </NavLink>
          <NavLink 
          to={`${match.url}users`} 
          style={linkStyle}
          >
            Users
          </NavLink>
          <NavLink 
          to={`${match.url}ringdowns`} 
          style={linkStyle}
          >
            Ringdowns
          </NavLink>
    </div>
  );
}
AdminNavigation.propTypes = {
  
};
