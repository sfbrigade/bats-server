import React from 'react';
import { Link } from 'react-router-dom';

import InvitesTable from './InvitesTable';
import UsersTable from './UsersTable';

function UsersList() {
  return (
    <main>
      <div className="display-flex flex-align-center flex-justify">
        <h1>Invites</h1>
        <Link to="/admin/users/new" className="usa-button usa-button--primary">
          Invite New User
        </Link>
      </div>
      <InvitesTable />
      <div className="display-flex flex-align-center flex-justify">
        <h1>Users</h1>
        <Link to="/admin/users/new" className="usa-button usa-button--primary">
          Add New User
        </Link>
      </div>
      <UsersTable />
    </main>
  );
}

export default UsersList;
