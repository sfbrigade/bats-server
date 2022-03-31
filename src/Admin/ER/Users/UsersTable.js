import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import ApiService from '../../../ApiService';
import Context from '../../../Context';

function UsersTable() {
  const { user } = useContext(Context);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (user) {
      // remove api calls and create reusable component
      ApiService.users.all().then((response) => {
        setUsers(response.data);
      });
    }
  }, [user]);

  return (
    <table className="usa-table usa-table--borderless width-full">
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id}>
            <td>{u.firstName}</td>
            <td>{u.lastName}</td>
            <td>{u.email}</td>
            <td>
              <Link to={`/admin/er/users/${u.id}`}>More &gt;</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default UsersTable;
