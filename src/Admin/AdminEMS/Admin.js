import React, { useState } from 'react';

import AdminNavigation from '../AdminNavigation';
import AdminInfo from '../../Models/AdminInfo';

import '../Admin.scss';

export default function AdminEMS() {
  const [adminInfo, setAdminInfo] = useState(new AdminInfo());
  const [stateChanged, setStateChanged] = useState(false);

  const handleClick = (tab) => {
    adminInfo.Tab = tab;
    adminInfo.setTabStatus();
    // need to remove this variable and use uesEffect instead to trigger rerender
    setStateChanged(!stateChanged);
  };

  return (
    <div className="admin height-full">
      <div className="bottom">
        <div className="grid-col bg-base-lighter height-full">
          <AdminNavigation click={handleClick} adminInfo={adminInfo} />
        </div>
        <div className="grid-col flex-4">
          {adminInfo.Tab === 'Dashboard' && <div>Dashboard</div>}
          {adminInfo.Tab === 'Users' && <div>Users</div>}
          {adminInfo.Tab === 'Ringdowns' && <div>Ringdowns</div>}
        </div>
      </div>
    </div>
  );
}
