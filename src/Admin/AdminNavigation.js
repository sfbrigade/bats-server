import React, { useState } from 'react';
import PropTypes from 'prop-types';

import AdminNavLink from './AdminNavLink';
import AdminInfo from '../Models/AdminInfo';

export default function AdminNavigation({ click, adminInfo }){
    const [tabChanged, setTabChanged] = useState(false)

      // restructure function to use an object to determine current tab
    const handleClick = (tab) => {
      setTabChanged(!tabChanged)
      click(tab);
    }

    return(
        
  <div>

    <nav aria-label="Secondary navigation,">
      <ul className="usa-sidenav">
        <AdminNavLink 
          title="Users"
          click={handleClick}
          isCurrent={adminInfo.tabStatus['usersTab'].currentStatus === 'CURRENT' ? true: false}
          />

        <AdminNavLink 
          title="Organizations"
          click={handleClick}
          isCurrent={adminInfo.tabStatus['organizationTab'].currentStatus === 'CURRENT' ? true: false}
          />
            <AdminNavLink 
          title="Add User"
          click={handleClick}
          isCurrent={adminInfo.tabStatus['addUserTab'].currentStatus === 'CURRENT' ? true: false}
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
