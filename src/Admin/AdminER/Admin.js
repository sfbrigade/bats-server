import React, { useState } from 'react';


import AdminNavigation from '../AdminNavigation';
import AdminUsers from '../AdminUsers';
import NewUserForm from '../NewUserForm';
import AdminInfo from '../../Models/AdminInfo';

//temp info for testing
import users from '../tempData'

import '../Admin.scss';


export default function AdminER() {

  const [adminInfo, setAdminInfo] = useState(new AdminInfo());
  const [stateChanged, setStateChanged] = useState(false);
 
  const handleClick = (tab) => {
    adminInfo.Tab = tab;
    adminInfo.setTabStatus();
    console.log(adminInfo.Tab);
    // need to remove this variable and use uesEffect instead to trigger rerender
    setStateChanged(!stateChanged);
  }

    return (
      <div className="admin height-full">
        <div className="bottom">
        <div className="grid-col bg-base-lighter height-full">
          <AdminNavigation click={handleClick} adminInfo={adminInfo} />
        </div>
        <div className="grid-col flex-4">
            {adminInfo.Tab === 'Dashboard' && <div>Dashboard</div>}
            {adminInfo.Tab === 'Users' && <AdminUsers users={users} />}
            {adminInfo.Tab === 'Ringdowns' && <div>Ringdowns</div>}
            
        </div>
        </div> 
      </div>);
    
}