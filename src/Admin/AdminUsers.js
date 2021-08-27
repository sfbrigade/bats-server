import { property } from 'lodash';
import { object } from 'prop-types';
import React, { useState } from 'react';

import AdminUser from './AdminUser';


import './AdminUsers.scss';
// users is an object containing info for each user
export default function AdminUsers(users){
  const [userObject, setUserObject] = useState(Object.values(users)[0]);
  const [userList, setUserList] = useState(Object.values(userObject));
  const adminUserList = [];
  let background = null

  for(let i = 0; i  < userList.length; i++){
    if (i % 2 === 0){
      background="admin__user__gray"
    } else {
      background = null;
    }
    let tempUserSetup = <AdminUser userName={userList[i].firstname + " " + userList[i].lastname} userId={userList[i].userid} userEmail={userList[i].email} userType={userList[i].usertype} userOrganization={userList[i].organization} background={background}/>
    adminUserList.push(tempUserSetup)
 };


    return(
        <div className="grid-container border margin-3 padding-2">
          <div className="admin__users__header grid-row border margin-1 padding-2">
            {/* repostion heading names */}
            <div className="grid-col-2">User Name</div>
            <div className="grid-col-2">User Id</div>
            <div className="grid-col-4">Email address</div>
            <div className="grid-col-2">Type</div>
            <div className="grid-col-2">Organization</div>
          </div>

          {adminUserList}
            
        </div>
    )
}