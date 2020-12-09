import React from 'react';

function Spinner() {
  return (
    <div className="display-flex flex-justify-center">
      <div className="spinner-border text-primary-vivid" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

export default Spinner;
