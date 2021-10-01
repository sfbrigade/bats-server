import React, { useState } from 'react';
import PropTypes from 'prop-types';

import AdminNavLink from './AdminNavLink';
import AdminInfo from '../Models/AdminInfo';

import './AdminNavigation.scss';

export default function AdminNavigation({ click, adminInfo }) {
  const [tabChanged, setTabChanged] = useState('');

  const handleClick = (tab) => {
    setTabChanged(tab);
    click(tab);
  };

  return (
    <div className="margin-y-6 padding-bottom-9">
      <nav aria-label="Secondary navigation,">
        <a className="header__logout h4" href="/auth/local/logout">
          Logout
        </a>
        <div>
          <div className="logo" />
          <button type="button" className=" edit_profile border-0 border-bottom bg-base-lighter button_text">
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
  // adminName: PropTypes.string.isRequired
};
