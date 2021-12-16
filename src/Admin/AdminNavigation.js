import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, Route, Switch } from "react-router-dom";

import AdminNavLink from './AdminNavLink';
import AdminInfo from '../Models/AdminInfo';
import ApiService from '../ApiService';

import UserInfo from './AdminER/UserInfo';

import './AdminNavigation.scss';
import { Router } from 'express';

export default function AdminNavigation({ click, adminInfo, mainUser, match, editMain, closeEditMain }) {
  const [tabChanged, setTabChanged] = useState('');
  const [editProfile, setEditProfile] = useState(false);

  const handleClick = (tab) => {
    closeEditMain()
    setTabChanged(tab);
    click(tab);
  };

  const Back = () => {
    setEditProfile(false);
  }

  return (
    <div className="margin-y-6 padding-bottom-9">
      <nav aria-label="Secondary navigation,">
        <a className="text-base-darkest" href="/auth/local/logout">
          Logout
        </a>
          <div className="logo" />
          <h2>{mainUser ? mainUser.activeHospitals[0].name : ''}</h2>
          <h4>{mainUser ? `${mainUser.firstName} ${mainUser.lastName}` : ''}</h4>
          <button 
          type="button" 
          className=" edit_profile bg-white border-0 border-bottom button_text"
          onClick={() => editMain()}
          >
            Edit Profile
          </button>
        
      <Router>
        <div>
        <Link to={`${match.url}/dashboard`}>
          Dashboard
          {/* <AdminNavLink title="Dashboard" click={handleClick} isCurrent={adminInfo.tabStatus.DashBoardTab.currentStatus === 'CURRENT'} /> */}
          </Link>
          <Link to={`${match.url}/user`}>
            Users
          {/* <AdminNavLink title="Users" click={handleClick} isCurrent={adminInfo.tabStatus.UsersTab.currentStatus === 'CURRENT'} /> */}
          </Link>
          <Link to={`${match.url}/ringdowns`}>
            Ringdowns
          {/* <AdminNavLink title="Ringdowns" click={handleClick} isCurrent={adminInfo.tabStatus.RingDownTab.currentStatus === 'CURRENT'} /> */}
          </Link>

          <Switch>
          <Route path="/dashboard">
          <UserInfo back={Back} user={mainUser} /> 
          </Route>
          {/* <Route path="/users">
            <Users />
          </Route>
          <Route path="/">
            <Home />
          </Route> */}
        </Switch>
      </div>
    </Router>
          
        
      </nav>
    </div>
  );
}
AdminNavigation.propTypes = {
  adminInfo: PropTypes.instanceOf(AdminInfo).isRequired,
  click: PropTypes.func.isRequired,
};
