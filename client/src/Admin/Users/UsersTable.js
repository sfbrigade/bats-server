import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import ApiService from '../../ApiService';
import Context from '../../Context';

function UsersTable({ isActive }) {
  const navigate = useNavigate();
  const { user, organization } = useContext(Context);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (user && organization) {
      const params = { organizationId: organization?.id };
      let request;
      if (isActive) {
        request = ApiService.users.active(params);
      } else {
        request = ApiService.users.index(params);
      }
      request.then((response) => {
        setUsers(response.data);
      });
    }
  }, [user, organization, isActive]);

  return (
    <table className="usa-table usa-table--striped usa-table--hoverable usa-table--borderless width-full">
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
          <tr key={u.id} onClick={() => navigate(`/admin/users/${u.id}`)}>
            <td>{u.firstName}</td>
            <td>{u.lastName}</td>
            <td>{u.email}</td>
            <td>
              <Link to={`/admin/users/${u.id}`}>More &gt;</Link>
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
