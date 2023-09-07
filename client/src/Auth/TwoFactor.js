import React from 'react';

export default function TwoFactor() {
  return (
    <div className="grid-container">
      <div className="grid-row">
        <div className="grid-col-10 grid-offset-1 tablet:grid-col-6 tablet:grid-offset-3 desktop:grid-col-4 desktop:grid-offset-4">
          <div className="text-center margin-top-6 margin-bottom-8">
            <h1 className="hospital-dest-title">
              <img src="/img/logomark-300.png" className="logo" alt="Routed logo" />
            </h1>
            <h4 className="text-base-light">Please enter the Authorization Code that was sent to your email address.</h4>
          </div>
        </div>
      </div>
    </div>
  );
}
