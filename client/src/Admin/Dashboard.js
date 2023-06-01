import React from 'react';

// import RingdownsTable from './Ringdowns/RingdownsTable';
import UsersTable from './Users/UsersTable';

export default function Dashboard() {
  console.log('DASHBOARD')
  return (
    <main>
      <div>
        <h1>Active Users</h1>
        <UsersTable isActive />
      </div>
      {/* <div>
        <h1>Incoming Ringdowns</h1>
        <RingdownsTable />
      </div> */}
    </main>
  );
}
