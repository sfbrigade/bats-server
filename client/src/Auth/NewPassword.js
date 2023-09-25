import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import ApiService from '../ApiService';

import Alert from './Components/Alert';
import RequiredInput from './Components/RequiredInput';
import { handleValidationEvent } from './Components/helperFunctions';

export default function NewPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const [invalid, setInvalid] = useState();
  const [invalidLink, setInvalidLink] = useState();
  const [error, setError] = useState();

  function isNotValid() {
    if (password !== '' && confirm !== '' && password === confirm) {
      return false;
    }
    return true;
  }

  async function onSubmit(event) {
    event.preventDefault();
    setInvalid();
    setInvalidLink();
    setError();
    try {
      await ApiService.auth.reset({
        email: searchParams.get('email'),
        code: searchParams.get('code'),
        password,
      });
      navigate('/login', { state: { flash: { success: 'Your password has been reset and you may log in using your new password.' } } });
    } catch (err) {
      if (err.response?.status === 422) {
        setInvalid(true);
      } else if (err.response?.status === 403) {
        setInvalidLink(true);
      } else {
        setError(true);
      }
    }
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
              Enter and confirm a new password for your account. Your new password must contain at least 8 characters, including upper and
              lowercase letters, a number, and a symbol.
            </h4>
            {invalid && <Alert input="Invalid password. Your password did not meet the requirements." />}
            {invalidLink && <Alert input="This link is no longer valid. Please request another." />}
            {error && <Alert input="An unexpected error has occurred. Please try again." />}
            <form onSubmit={onSubmit} id="confirm" className="usa-form">
              <RequiredInput
                type="password"
                label="Password"
                name="password"
                value={password}
                handleValidationEvent={handleValidationEvent}
                onChange={setPassword}
              />
              <RequiredInput
                type="password"
                label="Confirm"
                name="confirm"
                value={confirm}
                handleValidationEvent={handleValidationEvent}
                onChange={setConfirm}
              />
              <button type="submit" className="usa-button width-full" disabled={isNotValid()}>
                Reset Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
