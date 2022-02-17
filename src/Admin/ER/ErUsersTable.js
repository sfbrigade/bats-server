import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './ErUsersTable.scss';

export default function ErUsersTable({ more, users, mainUser, addUser }) {
  const [usersList, setUsersList] = useState(users);
  const [sortDirection, setSortDirection] = useState(1);

  function Sort(field) {
    const sortedList = usersList;
    // create sort function where I can pass the key and sort by case
    // place sting in square brackets
    switch (field) {
      case 'firstName':
        if (sortDirection === 1) {
          sortedList.sort((a, b) => {
            if (a.firstName > b.firstName) {
              return 1;
            }
            return -1;
          });
        } else {
          sortedList.sort((a, b) => {
            if (a.firstName < b.firstName) {
              return 1;
            }
            return -1;
          });
        }
        break;
      case 'lastName':
        if (sortDirection === 1) {
          sortedList.sort((a, b) => {
            if (a.lastName > b.lastName) {
              return 1;
            }
            return -1;
          });
        } else {
          sortedList.sort((a, b) => {
            if (a.lastName < b.lastName) {
              return 1;
            }
            return -1;
          });
        }
        break;
      case 'email':
        if (sortDirection === 1) {
          sortedList.sort((a, b) => {
            if (a.email > b.email) {
              return 1;
            }
            return -1;
          });
        } else {
          sortedList.sort((a, b) => {
            if (a.email < b.email) {
              return 1;
            }
            return -1;
          });
        }
        break;
      default:
        break;
    }
    setUsersList(sortedList);
    if (sortDirection === 1) {
      setSortDirection(0);
    } else {
      setSortDirection(1);
    }
  }
  return (
    <div>
      <button type="button" className="bg-white" onClick={() => addUser()}>
        Add User
      </button>
      <h2>Active</h2>
      <table cellSpacing="0" cellPadding="0">
        <tr>
          <th className="padding-2">
            First Name{' '}
            <button type="button" onClick={() => Sort('firstName')}>
              ^
            </button>
          </th>
          <th className="padding-2">
            Last Name{' '}
            <button type="button" onClick={() => Sort('lastName')}>
              ^
            </button>
          </th>
          <th className="padding-2">
            Email{' '}
            <button type="button" onClick={() => Sort('email')}>
              ^
            </button>
          </th>
        </tr>
        {usersList.map((user) =>
          user.organization.id === mainUser.organization.id && !user.isAdminUser ? (
            <tr>
              <td className="padding-2 row-border">{user.firstName}</td>
              <td className="padding-2 row-border">{user.lastName}</td>
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
