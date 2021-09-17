import React, { useState } from 'react';


import Header from '../../Components/Header';
import AdminNavigation from '../AdminNavigation';
import AdminUsers from '../AdminUsers';
import NewUserForm from '../NewUserForm';
import AdminInfo from '../../Models/AdminInfo';

//temp info for testing
import users from '../tempData'

import '../Admin.scss';


export default function AdminEMS() {

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
      <div className="admin">
            {/* <div className="top">
                <Header name="Hospital Selection Tool Admin Page" />
                 </div> */}
            <div className="bottom">
               <div className="side"><AdminNavigation click={handleClick} adminInfo={adminInfo} /></div>
               <div className="info_display">
                   {adminInfo.Tab === 'Users' && <AdminUsers users={users} />}
                   {/* organizations page will show the name of the organization how many users it 
                   has and a link to view all users specific to organization create function in model that
                   sorts through users accoding to organization */}
                   {adminInfo.Tab === 'Organizations' && <div>hello organizations</div>}
                   {adminInfo.Tab === 'Add User' && <NewUserForm />}
                   {/* {AdminInfo.currentTab === 'Remove User' && <div>hello Remove User</div>} */}

                   </div> 
            </div>
      </div>);
    
}