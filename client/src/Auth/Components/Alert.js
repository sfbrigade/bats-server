import React from 'react';

export default function Alert({ input, type = 'error' }) {
  return (
    <div className={`usa-alert usa-alert--${type} usa-alert--slim usa-alert--no-icon margin-bottom-3`}>
      <div className="usa-alert__body">
        <p className="usa-alert__text">{input}</p>
      </div>
    </div>
  );
}
