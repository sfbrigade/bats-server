import React, { useState } from 'react';
import axios from 'axios';

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
    // console.log(newUser.firstName, newUser.lastName, newUser.email, newUser.password);
    ApiService.users.create(newUser.toJson())
    .then((response) => {   
      setNewUser(new User);
       createdUser()
    })
    .catch((error) => {
       // eslint-disable-next-line no-console
       console.log(error.response.data);
       console.log("request", error.request)
    }); 
  }

  function cancel() {
    createdUser()
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