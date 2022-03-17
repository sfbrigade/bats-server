import React from 'react';

import RingdownsTable from './Ringdowns/RingdownsTable';
import UsersTable from './Users/UsersTable';

export default function Dashboard() {
  return (
    <main>
      <div>
        <h1>Active Nurses</h1>
        <UsersTable />
      </div>
      <div>
        <h1>Incoming Ringdowns</h1>
        <RingdownsTable />
      </div>
    </main>
  );
}
