import React from 'react';
import { useParams } from 'react-router';

import UserInfo from './UserInfo';
import UsersTable from './UsersTable';

function Users() {
  const { userId } = useParams();

  return (
    <>
      {userId ? (
        <main>
          <h1>User</h1>
          <UserInfo userId={userId} />
        </main>
      ) : (
        <main>
          <h1>Users</h1>
          <UsersTable />
        </main>
      )}
    </>
  );
}

export default Users;
