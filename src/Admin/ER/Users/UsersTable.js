import React, { useContext, useEffect, useState } from 'react';

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
    <table>
      <thead>
        <tr>
          <th className="padding-2">
            First Name <button type="button">^</button>
          </th>
          <th className="padding-2">
            Last Name <button type="button">^</button>
          </th>
          <th className="padding-2">
            Email <button type="button">^</button>
          </th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) =>
          u.organization.id === user.organization.id && !u.isAdminUser ? (
            <tr key={u.id}>
              <td className="padding-2 row-border">{u.firstName}</td>
              <td className="padding-2 row-border">{u.lastName}</td>
              <td className="padding-2 row-border">{u.email}</td>
              <td className="padding-2 row-border">
                <button type="button" className="border-0 bg-white">
                  More &gt;
                </button>
              </td>
            </tr>
          ) : null
        )}
      </tbody>
    </table>
  );
}

export default UsersTable;
