import React, { useState } from 'react';


import AdminNavigation from '../AdminNavigation';
import AdminUsers from '../AdminUsers';
import NewUserForm from '../NewUserForm';
import ErDashboard from './ErDashboard';
import UserInfo from '../UserInfo';
import AdminInfo from '../../Models/AdminInfo';

//temp info for testing
import users from '../tempData'

import '../Admin.scss';


export default function AdminER() {

  const [adminInfo, setAdminInfo] = useState(new AdminInfo());
  const [stateChanged, setStateChanged] = useState(false);
  const [showMore, setShowMore] = useState(false);
 
  const handleClick = (tab) => {
    adminInfo.Tab = tab;
    adminInfo.setTabStatus();
    console.log(adminInfo.Tab);
    // need to remove this variable and use uesEffect instead to trigger rerender
    setStateChanged(!stateChanged);
  }

  const More = () => {
    setShowMore(true);
  }
  const Back = () => {
    setShowMore(false);
  }
console.log(showMore, adminInfo.tab);
    return (
      <div className="admin height-full">
        <div className="bottom">
        <div className="grid-col-2 bg-base-lighter position-fixed">
          <AdminNavigation click={handleClick} adminInfo={adminInfo} />
        </div>
        <div className="grid-col flex-4 margin-left-9 padding-left-9 ">
            {adminInfo.Tab === 'Dashboard' && showMore === false ? <ErDashboard more={More} /> : <UserInfo back={Back} />}
            {adminInfo.Tab === 'Users' && <AdminUsers users={users} /> }
            {adminInfo.Tab === 'Ringdowns' && <div>Ringdowns</div>}
            
        </div>
        </div> 
      </div>);
    
}