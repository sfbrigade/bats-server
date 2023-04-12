import React from 'react';
import Error from './Error';
import Form from './Form';
import { Link } from 'react-router-dom';

export default function Login() {
  const url = new URL(window.location.href);
  const error = url.searchParams.get('error');
  const user = url.searchParams.get('user');

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
            {error && <Error />}
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
