import React, { useState } from 'react';
import RequiredInput from './RequiredInput';
import { handleValidationEvent } from './helperFunctions';

export default function Reset() {
  const [email, setEmail] = useState('');
  function isNotValid() {
    if (email !== '') {
      return false;
    }
    return true;
  }

  return (
    <div className="grid-container">
      <div className="grid-row">
        <div className="grid-col-10 grid-offset-1 tablet:grid-col-6 tablet:grid-offset-3 desktop:grid-col-4 desktop:grid-offset-4">
          <div className="text-center margin-top-6 margin-bottom-8">
            <h1 className="hospital-dest-title">
              <img src="/img/logomark-300.png" className="logo" alt="Routed logo" />
            </h1>
            <h4 className="text-base-light">
              Enter your email and we will send you a<br />
              link to code to reset your password.
            </h4>
            <form method="post" action="/auth/local/reset" id="reset" className="usa-form">
              <RequiredInput label="Email" name="email" value={email} handleValidationEvent={handleValidationEvent} onChange={setEmail} />
              <button type="submit" className="usa-button width-full" disabled={isNotValid()}>
                Send Code
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
