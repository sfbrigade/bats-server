import React, { useState } from 'react';
import PropTypes from 'prop-types';

import AdminNavLink from './AdminNavLink';
import AdminInfo from '../Models/AdminInfo';

import './AdminNavigation.scss';

export default function AdminNavigation({ click, adminInfo }){
    const [tabChanged, setTabChanged] = useState("")

    const handleClick = (tab) => {
      setTabChanged(tab)
      click(tab);
    }

    return(
        
  <div >

    <nav aria-label="Secondary navigation,">
      <div >
        <div className="logo"></div>
        <button className=" edit_profile border-0 border-bottom bg-base-lighter ">
          Edit Profile
          </button>
      </div >
      <ul className="usa-sidenav margin-bottom-9 padding-bottom-9">
        <AdminNavLink 
          title="Dashboard"
          click={handleClick}
          isCurrent={adminInfo.tabStatus['dashBoardTab'].currentStatus === 'CURRENT' ? true: false}
          />

        <AdminNavLink 
          title="Users"
          click={handleClick}
          isCurrent={adminInfo.tabStatus['usersTab'].currentStatus === 'CURRENT' ? true: false}
          />
            <AdminNavLink 
          title="Ringdowns"
          click={handleClick}
          isCurrent={adminInfo.tabStatus['ringDownTab'].currentStatus === 'CURRENT' ? true: false}
          />
      </ul>
    </nav>
  </div>
 
    )
}
AdminNavigation.propTypes = {
  adminInfo: PropTypes.instanceOf(AdminInfo).isRequired,
  click: PropTypes.func.isRequired,
};
