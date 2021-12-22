import React, { useContext, useState, useEffect } from 'react';
import { useRouteMatch } from "react-router-dom";

import AdminNavigation from '../AdminNavigation';
import ErDashboard from './ErDashboard';
import ErRingdowns from './ErRingdowns';
import ErUsers from './ErUsers';

import AdminInfo from '../../Models/AdminInfo';
import ApiService from '../../ApiService';
import Context from '../../Context';

import '../Admin.scss';
import UserInfo from './UserInfo';

export default function AdminER() {
  const [adminInfo, setAdminInfo] = useState(new AdminInfo());
  const [stateChanged, setStateChanged] = useState(false);
  const [users, setUsers] = useState(null);
  const { user } = useContext(Context);
  const [editProfile, setEditProfile] = useState(false);
  const [ringdowns, setRingdowns] = useState(null);

  const handleClick = (tab) => {
    adminInfo.Tab = tab;
    adminInfo.setTabStatus();
    // need to remove this variable and use uesEffect instead to trigger rerender
    setStateChanged(!stateChanged);
  };

  const Back = () => {
    setEditProfile(false);
  }

  const EditMain = () => {
    setEditProfile(true);
  }

  useEffect(() => {
    console.log("admin tab", adminInfo.Tab);
    // instead of getting all users create and api that only gets active users according who is signed on
    ApiService.users.all().then((response) => {
      if (users === null) {
        setUsers(response.data);
      }
    });
    ApiService.ringdowns.get(user?.activeHospitals[0].hospital.id).then((response) => {
      // console.log("Response: ", response.data);
      if (ringdowns === null) {
        setRingdowns(response.data);
      }
    }).catch((error) => {
      // console.log("Error", error);
    });

    // console.log("hello", user);
  },[]);

  // console.log("Ringdowns", ringdowns)
  // console.log("admin tab", adminInfo.Tab);
  return (
    <div>
      <div >
        <div className="border-bottom border-base-lightest height-15 width-full">
          <AdminNavigation click={handleClick} adminInfo={adminInfo} mainUser={user} editMain={EditMain} closeEditMain={Back} />
        </div>
        <div className="height-card-lg width-full">
        


          {editProfile && <UserInfo back={Back} user={user} />}
          {!editProfile && adminInfo.Tab === 'Dashboard' && <ErDashboard users={users} mainUser={user} allRingdowns={ringdowns} />}
          {!editProfile && adminInfo.Tab === 'Users' && <ErUsers users={users} mainUser={user} />}
          {!editProfile && adminInfo.Tab === 'Ringdowns' && <ErRingdowns allRingdowns={ringdowns} />}
        </div>
      </div>
    </div>
  );
}
