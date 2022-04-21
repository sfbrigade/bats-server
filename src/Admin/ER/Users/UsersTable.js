import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import ApiService from '../../../ApiService';
import Context from '../../../Context';

function UsersTable({ isActive }) {
  const { user } = useContext(Context);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (user) {
      let request;
      if (isActive) {
        request = ApiService.users.active();
      } else {
        request = ApiService.users.all();
      }
      request.then((response) => {
        setUsers(response.data);
      });
    }
  }, [user, isActive]);

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

UsersTable.propTypes = {
  isActive: PropTypes.bool,
};

UsersTable.defaultProps = {
  isActive: undefined,
};

export default UsersTable;
