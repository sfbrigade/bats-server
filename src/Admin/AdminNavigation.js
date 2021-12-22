import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useRouteMatch } from "react-router-dom";

import AdminNavLink from './AdminNavLink';
import AdminInfo from '../Models/AdminInfo';
import ApiService from '../ApiService';

import UserInfo from './AdminER/UserInfo';

import './AdminNavigation.scss';
// import { Router } from 'express';

export default function AdminNavigation({ click, adminInfo, mainUser, editMain, closeEditMain }) {
  const [tabChanged, setTabChanged] = useState('');
  let match = useRouteMatch();
  let ref = React.createRef()
  const handleClick = (tab) => {
    // closeEditMain()
    setTabChanged(tab);
    click(tab);
  };

  // const Back = () => {
  //   setEditProfile(false);
  // }
// console.log(mainUser);
  return (
    <div className="margin-y-6 padding-bottom-9">
      <nav aria-label="Secondary navigation,">
        <a className="text-base-darkest adminnav_login_logout" href="/auth/local/logout">
          Logout
        </a>
          <div className="adminnav_logo" />
          <h2 className="adminnav_hospital_name">{mainUser ? mainUser.activeHospitals[0].hospital.name : ''}</h2>
          {/* <h4>{mainUser ? `${mainUser.firstName} ${mainUser.lastName}` : ''}</h4> */}
          <button 
          type="button" 
          className=" adminnav_edit_profile text-primary bg-white border-0 border-bottom adminnav_button_text"
          onClick={() => editMain()}
          >
            Edit Profile
          </button>
        
        <Link 
          to={`${match.url}/dashboard`} 
          className="adminnav_link"
          // component={AdminNavLink}
        >
          {/* Dashboard */}
          <AdminNavLink title="Dashboard" click={handleClick} isCurrent={adminInfo.tabStatus.DashBoardTab.currentStatus === 'CURRENT'} />
          </Link>
          <Link to={`${match.url}/user`} className="adminnav_link">
            {/* Users */}
          <AdminNavLink title="Users" click={handleClick} isCurrent={adminInfo.tabStatus.UsersTab.currentStatus === 'CURRENT'} />
          </Link>
          <Link to={`${match.url}/ringdowns`} className="adminnav_link">
            {/* Ringdowns */}
          <AdminNavLink title="Ringdowns" click={handleClick} isCurrent={adminInfo.tabStatus.RingDownTab.currentStatus === 'CURRENT'} />
          </Link>
        
      </nav>
    </div>
  );
}
AdminNavigation.propTypes = {
  adminInfo: PropTypes.instanceOf(AdminInfo).isRequired,
  click: PropTypes.func.isRequired,
};
