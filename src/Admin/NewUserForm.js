import React from 'react';

import NewUserFields from './NewUserFields';

export default function NewUserForm() {
  const send = () => {
    // api call create for new user
  };
  return (
    <div className="margin-7">
      <h1> Create New User </h1>
      <NewUserFields />
      <button className="usa-button margin-2" type="button" onClick={send}>
        Create User
      </button>
    </div>
  );
}
