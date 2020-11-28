import React, { useState } from 'react';
import Counter from '../Components/counter';

const Beds = () => {
  
  return (
    <div className="cointainer">
      <h1> SF General ER </h1>
      <div>
        <h2> Available Beds </h2>
        <div id="erCountButtons">
          <Counter />
          <h5>ER Beds</h5>
          
       
        </div>
        <div id="psychCountButtons">
        <Counter/>
          <h5>Psych Beds</h5>
         
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
