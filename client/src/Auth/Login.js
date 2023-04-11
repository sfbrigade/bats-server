import React from 'react';

export default function Login() {
  let url = new URL(window.location.href);
  let user = url.searchParams.get('user');
  let error = url.searchParams.get('error');

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
          </div>
          {error && (
            <div className="usa-alert usa-alert--error usa-alert--slim usa-alert--no-icon margin-bottom-3">
              <div className="usa-alert__body">
                <p className="usa-alert__text">Invalid email and/or password.</p>
              </div>
            </div>
          )}
          <form method="post" action="/auth/local/login" id="login" className="usa-form">
            <div className="usa-form-group margin-y-4">
              <label htmlFor="username" className="usa-label usa-label--required">
                Email
              </label>
              <input type="email" id="username" defaultValue={user} name="username" placeholder="name@email.com" className="usa-input" />
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
        </div>
      </div>
      <script src="/scripts/login.js"></script>
    </div>
  );
}
