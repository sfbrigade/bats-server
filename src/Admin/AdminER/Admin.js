import React, { useState, useEffect } from 'react';

import AdminNavigation from '../AdminNavigation';
import ErDashboard from './ErDashboard';
import ErRingdowns from './ErRingdowns';
import ErUsers from './ErUsers';

import AdminInfo from '../../Models/AdminInfo';
import ApiService from '../../ApiService';

import '../Admin.scss';

export default function AdminER() {
  
  const [adminInfo, setAdminInfo] = useState(new AdminInfo());
  const [stateChanged, setStateChanged] = useState(false);
  const [users, setUsers] = useState(null);
  const [mainUser, setMainUser] = useState(null);

  const handleClick = (tab) => {
    adminInfo.Tab = tab;
    adminInfo.setTabStatus();
    // need to remove this variable and use uesEffect instead to trigger rerender
    setStateChanged(!stateChanged);
  };

  useEffect(() => {
    // instead of getting all users create and api that only gets active users according who is signed on
    ApiService.users.all().then((response) => {
      if (users === null) {
        setUsers(response.data);
      }
    });
    //this api call most likely not needed. can use useContext instead
    ApiService.users.me().then((response) => {
      if (mainUser === null) {
        setMainUser(response.data);
      }
    });
  });

  return (
    <div className="admin height-full">
      <div className="bottom">
        <div className="grid-col-2 position-fixed">
          <AdminNavigation click={handleClick} adminInfo={adminInfo} mainUser={mainUser} />
        </div>
        <div className="grid-col flex-4 margin-left-9 padding-left-9 ">
          {adminInfo.Tab === 'Dashboard' && <ErDashboard users={users} mainUser={mainUser} />}
          {adminInfo.Tab === 'Users' && <ErUsers users={users} mainUser={mainUser} />}
          {adminInfo.Tab === 'Ringdowns' && <ErRingdowns />}
        </div>
      </div>
    </div>
  );
}
