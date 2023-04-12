import React from 'react';

export default function Reset() {
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
            <form method="post" action="/auth/reset" id="reset" className="usa-form" onSubmit={() => onSubmit}>
              <div className="usa-form-group margin-y-4 text-left">
                <label htmlFor="username" className="usa-label">
                  Email
                </label>
                <input
                  type="email"
                  id="username"
                  name="username"
                  placeholder="name@email.com"
                  className="usa-input"
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={(e) => handleValidationEvent(e)}
                  onFocus={(e) => handleValidationEvent(e)}
                  onInput={(e) => handleValidationEvent(e)}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
