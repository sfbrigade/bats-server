import React, { useState } from 'react';


import Header from '../Components/Header';
import AdminNavigation from './AdminNavigation';
import AdminUsers from './AdminUsers';
import NewUserForm from './NewUserForm';

//temp info for testing
import users from './tempData'

import './Admin.scss';


export default function Admin() {

  const [page, setPage] = useState(0);

  // resturcture function to use an object used to show the current tab info
  const handleClick = (tab) => {
    if (tab === 'Users'){
      setPage(1);
    }
    if (tab === 'Organizations'){
      setPage(2);
    }
    if (tab === 'Add User'){
      setPage(3);
    }
    if (tab === 'Remove User'){
      setPage(4);
    }
    console.log(page)
  }

    return (
      <div className="admin">
            <div className="top">
                <Header name="Hospital Selection Tool Admin Page" />
                 </div>
            <div className="bottom">
               <div className="side"><AdminNavigation click={handleClick} /></div>
               <div className="info_display">
                   {page === 1 && <AdminUsers users={users} />}
                   {/* organizations page will show the name of the organization how many users it 
                   has and a link to view all users specific to organization create function in model that
                   sorts through users accoding to organization */}
                   {page === 2 && <div>hello organizations</div>}
                   {page === 3 && <NewUserForm />}
                   {page === 4 && <div>hello Remove User</div>}

                   </div> 
            </div>
      </div>);
    
}