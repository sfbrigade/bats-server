import React from 'react';

export default function Error() {
  return (
    <div className="usa-alert usa-alert--error usa-alert--slim usa-alert--no-icon margin-bottom-3">
      <div className="usa-alert__body">
        <p className="usa-alert__text">Invalid email and/or password.</p>
      </div>
    </div>
  );
}
