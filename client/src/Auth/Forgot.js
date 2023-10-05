import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import ApiService from '../ApiService';
import Alert from './Components/Alert';
import RequiredInput from './Components/RequiredInput';
import { handleValidationEvent } from './Components/helperFunctions';

export default function Forgot() {
  const [email, setEmail] = useState('');

  const [invalid, setInvalid] = useState();
  const [error, setError] = useState();
  const [success, setSuccess] = useState();

  function isNotValid() {
    if (email !== '') {
      return false;
    }
    return true;
  }

  async function onSubmit(event) {
    event.preventDefault();
    setError();
    setInvalid();
    try {
      await ApiService.auth.forgot({ email });
      setSuccess(true);
    } catch (err) {
      if (err.response?.status === 404) {
        setInvalid(true);
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
              Enter your email and we will send you a<br />
              link to reset your password.
            </h4>
            {invalid && <Alert input="Invalid email address." />}
            {error && <Alert input="An unexpected error has occurred. Please try again." />}
            {success && (
              <Alert
                type="success"
                input="Please check your email for a reset password link. It may take a few minutes for the email to arrive."
              />
            )}
            {!success && (
              <form className="usa-form" onSubmit={onSubmit}>
                <RequiredInput label="Email" name="email" value={email} handleValidationEvent={handleValidationEvent} onChange={setEmail} />
                <button type="submit" className="usa-button width-full" disabled={isNotValid()}>
                  Send Reset Link
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
