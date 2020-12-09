import React from 'react';

function Spinner() {
  return (
    <div class="display-flex flex-justify-center">
      <div class="spinner-border text-primary-vivid" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  );
}

export default Spinner;
