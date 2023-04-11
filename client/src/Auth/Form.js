import React from 'react';

export default function Form(props) {
  return (
    <form method="post" action="/auth/local/login" id="login" className="usa-form">
      <div className="usa-form-group margin-y-4">
        <label htmlFor="username" className="usa-label usa-label--required">
          Email
        </label>
        <input type="email" id="username" defaultValue={props.user} name="username" placeholder="name@email.com" className="usa-input" />
      </div>
      <div className="usa-form-group margin-y-4">
        <label htmlFor="password" className="usa-label usa-label--required">
          Password
        </label>
        <input type="password" id="password" name="password" className="usa-input" />
      </div>
      <button type="submit" className="usa-button width-full">
        Login
      </button>
    </form>
  );
}
