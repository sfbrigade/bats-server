import React, { useState } from 'react';
import RequiredInput from './Components/RequiredInput';
import { handleValidationEvent } from './Components/helperFunctions';
import { Link } from 'react-router-dom';

export default function Reset() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  function isNotValid() {
    if (password !== '' && confirm !== '' && password === confirm) {
      return false;
    }
    return true;
  }
  return (
    <div className="grid-container">
      <div className="grid-row">
        <div className="grid-col-10 grid-offset-1 tablet:grid-col-6 tablet:grid-offset-3 desktop:grid-col-4 desktop:grid-offset-4">
          <div className="text-center margin-top-6 margin-bottom-8">
            <Link to="/">
              <h1 className="hospital-dest-title">
                <img src="/img/logomark-300.png" className="logo" alt="Routed logo" />
              </h1>
            </Link>
            <h4 className="text-base-light">
              Enter and confirm a new password
              <br />
              for your account
            </h4>
            <form method="post" action="/auth/local/newPassword" id="confirm" className="usa-form">
              <RequiredInput
                label="Password"
                name="password"
                value={password}
                handleValidationEvent={handleValidationEvent}
                onChange={setPassword}
              />
              <RequiredInput
                label="Confirm"
                name="password"
                value={confirm}
                handleValidationEvent={handleValidationEvent}
                onChange={setConfirm}
              />

              <button type="submit" className="usa-button width-full" disabled={isNotValid()}>
                Reset Password
              </button>
              {isNotValid() ? (
                <span class="usa-error-message">
                  <i class="fas fa-exclamation-circle"></i> Passwords must match
                </span>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
