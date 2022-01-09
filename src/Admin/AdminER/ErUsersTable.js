import React from 'react';
import PropTypes from 'prop-types';

import './ErUsersTable.scss';

export default function ErUsersTable({ more, users, mainUser, addUser }) {
  return (
    <div>
      <button type="button" className="bg-white" onClick={() => addUser()}>
        Add User
      </button>
      <h2>Active</h2>
      <table cellSpacing="0" cellPadding="0">
        <tr>
          <th className="padding-2">Name</th>
          <th className="padding-2">Email</th>
        </tr>
        {users.map((user) =>
          user.organization.id === mainUser.organization.id && !user.isAdminUser ? (
            <tr>
              <td className="padding-2 row-border">
                {user.firstName} {user.lastName}
              </td>
              <td className="padding-2 row-border">{user.email}</td>
              <td className="padding-2 row-border">
                <button type="button" className="border-0 bg-white" onClick={() => more(user)}>
                  More &gt;
                </button>
              </td>
            </tr>
          ) : null
        )}
      </table>
    </div>
  );
}
ErUsersTable.propTypes = {
  more: PropTypes.func.isRequired,
  addUser: PropTypes.func.isRequired,
  users: PropTypes.shape({
    email: PropTypes.string,
    firstName: PropTypes.string,
    id: PropTypes.string,
    isActive: PropTypes.bool,
    isAdminUser: PropTypes.bool,
    isOperationalUser: PropTypes.bool,
    isSuperUser: PropTypes.bool,
    lastName: PropTypes.string,
  }).isRequired,
  mainUser: PropTypes.shape({
    email: PropTypes.string,
    firstName: PropTypes.string,
    id: PropTypes.string,
    isActive: PropTypes.bool,
    isAdminUser: PropTypes.bool,
    isOperationalUser: PropTypes.bool,
    isSuperUser: PropTypes.bool,
    lastName: PropTypes.string,
    organization: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      type: PropTypes.string,
    }),
  }).isRequired,
};
