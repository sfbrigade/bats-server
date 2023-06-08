import React from 'react';

import { Link } from 'react-router-dom';

export default function ConfirmCode() {
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
            <h4 className="margin-top-10">
              A link to reset your password has
              <br />
              been sent to your email
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}
