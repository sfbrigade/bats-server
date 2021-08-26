import React, { useState } from 'react';
import PropTypes from 'prop-types';

import AdminNavLink from './AdminNavLink';

export default function AdminNavigation({ click }){
    const [currentTab, setCurrentTab] = useState(0)

      // restructure function to use an object to determine current tab
    const handleClick = (tab) => {
      if (tab === 'Users'){
        setCurrentTab(1);
      }
      if (tab === 'Organizations'){
        setCurrentTab(2);
      }
      if (tab === 'Add User'){
        setCurrentTab(3);
      }
      if (tab === 'Remove User'){
        setCurrentTab(4);
      }
      click(tab);
    }

    return(
        
  <div>

    <nav aria-label="Secondary navigation,">
      <ul className="usa-sidenav">
        <AdminNavLink 
          title="Users"
          click={handleClick}
          isCurrent={currentTab === 1 ? true: false}
          />

        <AdminNavLink 
          title="Organizations"
          click={handleClick}
          isCurrent={currentTab === 2 ? true: false}
          />
            <AdminNavLink 
          title="Add User"
          click={handleClick}
          isCurrent={currentTab === 3 ? true: false}
          />
            <AdminNavLink 
          title="Remove User"
          click={handleClick}
          isCurrent={currentTab === 4 ? true: false}
          />
      </ul>
    </nav>
  </div>
 
    )
}
AdminNavigation.propTypes = {
  click: PropTypes.func.isRequired,
};
