import React from 'react';
import { Link, useParams } from 'react-router-dom';

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
          <div className="display-flex flex-align-center flex-justify">
            <h1>Users</h1>
            <Link to="/admin/er/users/new" className="usa-button usa-button--primary">
              Add New User
            </Link>
          </div>
          <UsersTable />
        </main>
      )}
    </>
  );
}

export default Users;
