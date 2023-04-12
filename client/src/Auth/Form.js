import React from 'react';
import { useState } from 'react';

export default function Form(props) {
  const errorHTML = `<span class="usa-error-message"><i class="fas fa-exclamation-circle"></i> This is a required field</span>`;
  const inputErrorClass = 'usa-input--error';
  const labelErrorClass = 'usa-label--error';

  const [email, setEmail] = useState(props.user);
  const [password, setPassword] = useState();

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

  function updateErrorState(input) {
    const label = input.previousElementSibling;
    if (input.value !== '') {
      // if previously in error, remove that state

      if (input.classList.contains(inputErrorClass)) {
        label.classList.remove(labelErrorClass);
        input.classList.remove(inputErrorClass);

        input.nextElementSibling.remove();
      }
    } else {
      // show error
      if (input.nextElementSibling) {
        input.nextElementSibling.remove();
      }
      label.classList.add(labelErrorClass);
      input.classList.add(inputErrorClass);
      input.insertAdjacentHTML('afterend', errorHTML);
    }
  }

  function handleValidationEvent(event) {
    const input = event.target;
    const label = input.previousElementSibling;
    // update the label's focused state
    label.classList[event.type === 'blur' ? 'remove' : 'add']('usa-label--focused');
    // update the class on input event only if the element is in the error state
    if (event.type === 'blur' || (event.type === 'input' && input.classList.contains(inputErrorClass))) {
      updateErrorState(input);
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
          value={email}
          name="username"
          placeholder="name@email.com"
          className="usa-input"
          onChange={(e) => {
            setEmail(e.target.value);
            handleValidationEvent(e);
          }}
          onBlur={(e) => handleValidationEvent(e)}
          onFocus={(e) => handleValidationEvent(e)}
        />
      </div>
      <div className="usa-form-group margin-y-4 text-left">
        <label htmlFor="password" className="usa-label">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          className="usa-input"
          onChange={(e) => {
            setPassword(e.target.value);
            handleValidationEvent(e);
          }}
          onBlur={(e) => handleValidationEvent(e)}
          onFocus={(e) => handleValidationEvent(e)}
        />
      </div>
      <button type="submit" className="usa-button width-full" disabled={isNotValid()}>
        Login
      </button>
    </form>
  );
}
