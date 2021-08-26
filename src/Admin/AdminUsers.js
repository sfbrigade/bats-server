import { property } from 'lodash';
import { object } from 'prop-types';
import React, { useState } from 'react';

import AdminUser from './AdminUser';


import './AdminUsers.scss';
// users is an object containing info for each user
export default function AdminUsers(users){
  const [userOject, setUserOject] = useState(Object.values(users)[0]);
  const [userList, setUserList] = useState(Object.values(userOject))
  
  console.log("userOject", userList);

 

    return(
        <div className="admin__users border margin-3 padding-2">
          <div className="admin__users__header border padding-2">
            {/* repostion heading names */}
            <div>User Name</div>
            <div>User Id</div>
            <div>Email address</div>
            <div>Type</div>
            <div>Organization</div>
          </div>
          {/* create function to populate AdminUser and alternates background colors */}
          {/* this will be the page that also shows users specific to organizations or type */}
            <AdminUser 
                   userName="Jane Doe" 
                   userId="1234"
                   userEmail="janeDoe@email.com"
                   userType="ER"
                   userOrganization="SFFD"
                   />
                     <AdminUser 
                   userName="John Doe" 
                   userId="1234"
                   userEmail="janeDoe@email.com"
                   userType="EMS"
                   userOrganization="SFFD"
                   background="admin__user__gray"
                   />
                     <AdminUser 
                   userName="Chris Doe" 
                   userId="1234"
                   userEmail="janeDoe@email.com"
                   userType="EMS"
                   userOrganization="SFFD"
                   />
                     <AdminUser 
                   userName="Olivia Doe" 
                   userId="1234"
                   userEmail="janeDoe@email.com"
                   userType="ER"
                   userOrganization="SFFD"
                   background="admin__user__gray"
                   />
                     <AdminUser 
                   userName="Oliver Doe" 
                   userId="1234"
                   userEmail="janeDoe@email.com"
                   userType="EMS"
                   userOrganization="SFFD"
                   />
                
        </div>
    )
}