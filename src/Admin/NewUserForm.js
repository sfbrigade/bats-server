import React, { useState } from 'react';
import axios from 'axios';

import NewUser from '../Models/NewUser';
import ApiService from '../ApiService';

import NewUserFields from './NewUserFields';

export default function NewUserForm({ createdUser }) {
  const [newUser, setNewUser] = useState(new NewUser());

  function onChange(property, value) {
    newUser[property] = value;
    setNewUser(new NewUser(newUser.payload));
  }

  function createUser() {
    console.log(newUser.firstName, newUser.lastName, newUser.email, newUser.password);
    // ApiService.users.create(newUser.toJson())
    // .then((response) => {   
    //   setNewUser(new NewUser);
    //    createdUser()
    // })
    // .catch((error) => {
    //    // eslint-disable-next-line no-console
    //    console.log(error.response.data);
    //    console.log("request", error.request)
    // });
    axios.post('/api/users/', {
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      password: newUser.password,
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error.response.data);
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
