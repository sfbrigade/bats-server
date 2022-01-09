import React, { useState } from 'react';
import PropTypes from 'prop-types';

import User from '../Models/User';
import ApiService from '../ApiService';

import NewUserFields from './NewUserFields';

export default function NewUserForm({ createdUser }) {
  const [newUser, setNewUser] = useState(new User());

  function onChange(property, value) {
    newUser[property] = value;
    setNewUser(new User(newUser.payload));
  }

  function createUser() {
    ApiService.users
      .create(newUser.toJson())
      .then(() => {
        setNewUser(new User());
        createdUser();
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error.response.data);
      });
  }

  function cancel() {
    createdUser();
  }

  return (
    <div className="margin-7">
      <h1> Create New User </h1>
      <NewUserFields newUser={newUser} onChange={onChange} />
      <button className="usa-button margin-2" type="button" onClick={() => createUser()}>
        Create User
      </button>
      <button className="usa-button margin-2" type="button" onClick={() => cancel()}>
        Cancel
      </button>
    </div>
  );
}
NewUserForm.propTypes = {
  createdUser: PropTypes.func.isRequired,
};
