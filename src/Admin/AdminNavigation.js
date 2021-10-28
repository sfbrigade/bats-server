import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

import AdminNavLink from './AdminNavLink';
import AdminInfo from '../Models/AdminInfo';
import ApiService from '../ApiService';

import './AdminNavigation.scss';

export default function AdminNavigation({ click, adminInfo, mainUser, match, editMain, closeEditMain }) {
  const [tabChanged, setTabChanged] = useState('');

  const handleClick = (tab) => {
    closeEditMain()
    setTabChanged(tab);
    click(tab);
  };

  return (
    <div className="margin-y-6 padding-bottom-9">
      <nav aria-label="Secondary navigation,">
        <a className="text-base-darkest" href="/auth/local/logout">
          Logout
        </a>
        <div>
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
        </div>
        <ul className="usa-sidenav margin-y-1 padding-bottom-2">
        <Link to={`${match.url}/dashboard`}>
          <AdminNavLink title="Dashboard" click={handleClick} isCurrent={adminInfo.tabStatus.DashBoardTab.currentStatus === 'CURRENT'} />
          </Link>
          <Link to={`${match.url}/user`}>
          <AdminNavLink title="Users" click={handleClick} isCurrent={adminInfo.tabStatus.UsersTab.currentStatus === 'CURRENT'} />
          </Link>
          <Link to={`${match.url}/ringdowns`}>
          <AdminNavLink title="Ringdowns" click={handleClick} isCurrent={adminInfo.tabStatus.RingDownTab.currentStatus === 'CURRENT'} />
          </Link>
          
        </ul>
      </nav>
    </div>
  );
}
AdminNavigation.propTypes = {
  adminInfo: PropTypes.instanceOf(AdminInfo).isRequired,
  click: PropTypes.func.isRequired,
};
