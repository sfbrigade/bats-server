import React from 'react';

import RingdownsTable from './Ringdowns/RingdownsTable';
import UsersTable from './Users/UsersTable';

export default function Dashboard() {
  return (
    <div className="margin-left-9 padding-left-2">
      <div>
        <div>
          <h2>Active Nurses</h2>
          <UsersTable />
        </div>
        <div>
          <h2>Incoming Ringdowns</h2>
          <RingdownsTable />
        </div>
      </div>
    </div>
  );
}
