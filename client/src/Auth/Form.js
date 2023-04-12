import React from 'react';
import { useState } from 'react';
import { updateErrorState, handleValidationEvent } from './helperFunctions';
import RequiredInput from './RequiredInput';

export default function Form(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  function isNotValid() {
    if (email !== undefined && password !== undefined) {
      return false;
    }
    return true;
  }

  function onSubmit(event) {
    if (!isNotValid()) {
      updateErrorState(email);
      updateErrorState(password);
      event.preventDefault();
    }
  }

  return (
    <form method="post" action="/auth/local/login" id="login" className="usa-form" onSubmit={() => onSubmit}>
      <RequiredInput
        type="Email"
        name="username"
        label="Username"
        defaultValue={props.username}
        handleValidationEvent={handleValidationEvent}
        onChange={setEmail}
      />
      <RequiredInput
        type="Password"
        name="password"
        label="Password"
        value={password}
        handleValidationEvent={handleValidationEvent}
        onChange={setPassword}
      />
      <button type="submit" className="usa-button width-full" disabled={isNotValid()}>
        Login
      </button>
    </form>
  );
}
