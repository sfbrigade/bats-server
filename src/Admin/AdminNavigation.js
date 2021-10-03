import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import AdminNavLink from './AdminNavLink';
import AdminInfo from '../Models/AdminInfo';
import ApiService from '../ApiService';

import './AdminNavigation.scss';

export default function AdminNavigation({ click, adminInfo, mainUser }) {
  const [tabChanged, setTabChanged] = useState('');

  const handleClick = (tab) => {
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
          <button type="button" className=" edit_profile bg-white border-0 border-bottom button_text">
            Edit Profile
          </button>
        </div>
        <ul className="usa-sidenav margin-y-9 padding-bottom-9">
          <AdminNavLink title="Dashboard" click={handleClick} isCurrent={adminInfo.tabStatus.DashBoardTab.currentStatus === 'CURRENT'} />

          <AdminNavLink title="Users" click={handleClick} isCurrent={adminInfo.tabStatus.UsersTab.currentStatus === 'CURRENT'} />
          <AdminNavLink title="Ringdowns" click={handleClick} isCurrent={adminInfo.tabStatus.RingDownTab.currentStatus === 'CURRENT'} />
        </ul>
      </nav>
    </div>
  );
}
AdminNavigation.propTypes = {
  adminInfo: PropTypes.instanceOf(AdminInfo).isRequired,
  click: PropTypes.func.isRequired,
};
