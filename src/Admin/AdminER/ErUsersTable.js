import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Heading from '../../Components/Heading';

import './ErUsersTable.scss';

export default function ErUsersTable({ more, users, mainUser, addUser }) {
  // may be able to replace mainUser with user
  const userRows = [];
  let temp = null;

  // console.log(users)
  for (const user of users) {
    if (user.organization.id === mainUser.organization.id && !user.isAdminUser) {
      temp = (
        <tr>
          <td className="padding-2 row-border">{user.firstName} {user.lastName}</td>
          <td className="padding-2 row-border">{user.email}</td>
          <td className="padding-2 row-border">
            <button type="button" className="border-0 bg-white" onClick={() => more(user)}>
              More &gt;
            </button>
          </td>
        </tr>
      );
    }
    if (userRows.indexOf(temp) === -1) {
      userRows.push(temp);
    }
  }


  return (
    <div className="margin-y-5">
      {/* will need a different header for this page */}
      <button type="button" className="bg-white" onClick={() => addUser()}>Add User</button>
      <Heading title="Active" />
      <table cellSpacing="0" cellPadding="0">
        <tr>
          <th className="padding-2">Name</th>
          <th className="padding-2">Email</th>
        </tr>
        {userRows}
      </table>
    </div>
  );
}
ErUsersTable.propTypes = {
  more: PropTypes.func.isRequired,
};
