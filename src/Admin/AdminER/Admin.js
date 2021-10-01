import React, { useState, useEffect } from 'react';


import AdminNavigation from '../AdminNavigation';
import NewUserForm from '../NewUserForm';
import ErDashboard from './ErDashboard';
import ErRingdowns from './ErRingdowns';
import ErUsers from './ErUsers';

import AdminInfo from '../../Models/AdminInfo';
import ApiService from '../../ApiService';

//temp info for testing
import users from '../tempData'

import '../Admin.scss';


export default function AdminER() {

  const [adminInfo, setAdminInfo] = useState(new AdminInfo());
  const [stateChanged, setStateChanged] = useState(false);
 const [users, setUsers] = useState(null);
 const [mainUser, setMainUser] = useState(null);

  const handleClick = (tab) => {
    adminInfo.Tab = tab;
    adminInfo.setTabStatus();
    console.log(adminInfo.Tab);
    // need to remove this variable and use uesEffect instead to trigger rerender
    setStateChanged(!stateChanged);
  }

  useEffect (() => {
    ApiService.users.all().then((response) => {
      if (users === null){
      setUsers(response.data);
      }
    });
    ApiService.users.me().then((response) => {
      if (mainUser === null){
      setMainUser(response.data);
      }
    });

  })
 
console.log(users);
console.log("mainUser", mainUser)
    return (
      <div className="admin height-full">
        <div className="bottom">
        <div className="grid-col-2 bg-base-lighter position-fixed">
          <AdminNavigation click={handleClick} adminInfo={adminInfo}/>
        </div>
        <div className="grid-col flex-4 margin-left-9 padding-left-9 ">
            {adminInfo.Tab === 'Dashboard' &&  <ErDashboard />}
            {adminInfo.Tab === 'Users' && <ErUsers users={users} />}
            {adminInfo.Tab === 'Ringdowns' && <ErRingdowns />}
            
        </div>
        </div> 
      </div>);
    
}