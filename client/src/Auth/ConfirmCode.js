import React, { useState } from 'react';
import RequiredInput from './Components/RequiredInput';
import { handleValidationEvent } from './Components/helperFunctions';
import { Link } from 'react-router-dom';
import Error from './Components/Error';

export default function ConfirmCode() {
  const [code, setCode] = useState('');
  const url = new URL(window.location.href);
  const error = url.searchParams.get('error');

  function isNotValid() {
    if (code !== '') {
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
              Enter the code that you
              <br />
              received in you Email
            </h4>
            {error && <Error input="Incorrect code" />}
            <form method="post" action="/auth/local/confirm" id="confirm" className="usa-form">
              <RequiredInput label="Code" name="code" value={code} handleValidationEvent={handleValidationEvent} onChange={setCode} />
              <button type="submit" className="usa-button width-full" disabled={isNotValid()}>
                Confirm
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
