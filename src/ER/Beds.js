import React, { useState } from 'react';

const Beds = () => {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const handleDecrement = () => {
    setCount((prevCount) => prevCount - 1);
  };

  return (
    <div className="cointainer">
      <h1> SF General ER </h1>
      <div>
        <h2> Available Beds </h2>
        <div id="erCountButtons">
          <button type="button" onClick={handleDecrement}>
            -
          </button>
          <h5>ER Beds {count}</h5>
          <button type="button" onClick={handleIncrement}>
            +
          </button>
        </div>
        <div id="psychCountButtons">
          <button type="button" onClick={handleDecrement}>
            -
          </button>
          <h5>Psych Beds {count}</h5>
          <button type="button" onClick={handleIncrement}>
            +
          </button>
        </div>
        <div id="erNotesForm">
          <label htmlFor="erNotes">
            ER Notes:
            <textarea id="erNotes" name="erNotes" rows="4" cols="50" />
          </label>
          <button type="button"> Save </button>
        </div>
        <div id="onDiversionForm">
          On diversion{' '}
          <b>
            <span className="onDiversion"> NO </span>{' '}
          </b>{' '}
          <button type="button"> Change </button>
        </div>
      </div>
    </div>
  );
};

export default Beds;
