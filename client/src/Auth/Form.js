import React from 'react';
import { useState } from 'react';
import { handleValidationEvent, updateErrorState } from './Helper';

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
      <div className="usa-form-group margin-y-4 text-left">
        <label htmlFor="username" className="usa-label">
          Email
        </label>
        <input
          type="email"
          id="username"
          defaultValue={props.user}
          name="username"
          placeholder="name@email.com"
          className="usa-input"
          onChange={(e) => setEmail(e.target.value)}
          onBlur={(e) => handleValidationEvent(e)}
          onFocus={(e) => handleValidationEvent(e)}
          onInput={(e) => handleValidationEvent(e)}
        />
      </div>
      <div className="usa-form-group margin-y-4 text-left">
        <label htmlFor="password" className="usa-label">
          Password
        </label>
        <input
          type="password"
          value={password}
          id="password"
          name="password"
          className="usa-input"
          onChange={(e) => setPassword(e.target.value)}
          onBlur={(e) => handleValidationEvent(e)}
          onFocus={(e) => handleValidationEvent(e)}
          onInput={(e) => handleValidationEvent(e)}
        />
      </div>
      <button type="submit" className="usa-button width-full" disabled={isNotValid()}>
        Login
      </button>
    </form>
  );
}
