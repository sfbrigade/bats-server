import React from 'react';
import classNames from 'classnames';

function Spinner({ className, size }) {
  return (
    <div className={classNames('display-flex flex-justify-center', className)}>
      <div className={classNames('spinner-border text-primary-vivid', { 'spinner-border-sm': size === 'sm' })} role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

export default Spinner;
