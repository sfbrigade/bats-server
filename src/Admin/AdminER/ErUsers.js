import React, { useState } from 'react';

import PropTypes from 'prop-types';
import UserInfo from './UserInfo';
import ErUsersTable from './ErUsersTable';
import NewUserForm from '../NewUserForm';


export default function ErUsers({ users, mainUser }) {
  const [showMore, setShowMore] = useState(false);
  const [addUser, setAddUser] = useState(false);
  const [user, setUser] = useState(null);

  const More = (user) => {
    setShowMore(true);
    setUser(user);
  };

  const Back = () => {
    setShowMore(false);
  };

  const addNewUser = () => {
    setAddUser(true)
  }

  // change name. Current name makes the assumption that a user will be created but UI allows for the 
  // process to be cancelled. Alternatively there could be a second function of course that function
  // could exist in the new user form.
  const savedUser = () => {

    setAddUser(false)
  }

  return (
    <div className="margin-left-9 padding-left-2">
      {showMore === true && <UserInfo back={Back} user={user} />}
      {showMore === false && addUser === false && <ErUsersTable more={More} addUser={addNewUser} users={users} mainUser={mainUser} />}
      {addUser === true && <NewUserForm createdUser={savedUser} />}
    </div>
  );
}
