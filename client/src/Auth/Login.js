import React from 'react';
import Error from './Components/Error';
import Form from './Components/Form';
import { Link } from 'react-router-dom';

export default function Login() {
  const url = new URL(window.location.href);
  const error = url.searchParams.get('error');
  const user = url.searchParams.get('user');
  const auth = url.searchParams.get('auth');
  const reset = url.searchParams.get('reset');

  return (
    <div className="grid-container">
      <div className="grid-row">
        <div className="grid-col-10 grid-offset-1 tablet:grid-col-6 tablet:grid-offset-3 desktop:grid-col-4 desktop:grid-offset-4">
          <div className="text-center margin-top-6 margin-bottom-8">
            <h1 className="hospital-dest-title">
              <img src="/img/logomark-300.png" className="logo" alt="Routed logo" />
            </h1>
            <h4 className="text-base-light">
              Start by entering your
              <br />
              email and password below.
            </h4>
            {reset && <Error input="Your password has been reset. You may now log in." />}
            {auth && <Error input="Invalid attempt. You are not authorized." />}
            {error && <Error input="Invalid email and/or password." />}
            <Form username={user} />
            <Link to="/reset">
              <button className="usa-button width-full margin-top-3"> Reset Password</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}