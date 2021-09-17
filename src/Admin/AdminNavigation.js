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
      <div>

      </div>
      <ul className="usa-sidenav margin-y-7 padding-y-7">
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
