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
  let match = useRouteMatch();

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
    // instead of getting all users create and api that only gets active users according who is signed on
    ApiService.users.all().then((response) => {
      if (users === null) {
        setUsers(response.data);
      }
    });
    ApiService.ringdowns.get(user?.activeHospitals[0].hospital.id).then((response) => {
      console.log("Response: ", response.data);
      if (ringdowns === null) {
        setRingdowns(response.data);
      }
    }).catch((error) => {
      console.log("Error", error);
    });

    console.log("hello", user);
  });

  console.log("Ringdowns", ringdowns)

  return (
    <div className="admin height-full">
      <div className="bottom">
        <div className="grid-col-2 position-fixed">
          <AdminNavigation click={handleClick} adminInfo={adminInfo} mainUser={user} match={match} editMain={EditMain} closeEditMain={Back} />
        </div>
        <div className="grid-col flex-4 margin-left-9 padding-left-9 ">
          {editProfile && <UserInfo back={Back} user={user} />}
          {!editProfile && adminInfo.Tab === 'Dashboard' && <ErDashboard users={users} mainUser={user} />}
          {!editProfile && adminInfo.Tab === 'Users' && <ErUsers users={users} mainUser={user} />}
          {!editProfile && adminInfo.Tab === 'Ringdowns' && <ErRingdowns allRingdowns={ringdowns} />}
        </div>
      </div>
    </div>
  );
}
