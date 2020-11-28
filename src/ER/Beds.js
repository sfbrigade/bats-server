import React, { useState } from 'react';
import Counter from '../Components/counter';
import Banner from '../Components/banner';

const Beds = () => {
  const DiversionStyle = {
    "background-color": "#005ea2",
    "width": "5px"
  }
  
  return (
    <div className="cointainer">
      <Banner BannerTitle="Bed availability" />
      <div>
        <div id="erCountButtons">
          <Counter CountTitle="ER Beds" />
        </div>
        <div id="psychCountButtons">
        <Counter CountTitle="Psych Beds"/>
         </div>

        <div id="erNotesForm">
        <Banner BannerTitle="Addtl. Notes (optional)" />
          <label htmlFor="erNotes">
          ER conditions:
            <textarea id="erNotes" name="erNotes" rows="4" cols="50" />
          </label>
          <button className="usa-button"> Update </button>
        </div>
        <div id="onDiversionForm">
          <Banner BannerTitle="Diversion status" />

          <div className="grid-row height-7 width-card-lg">
    <div class="grid-col-1" style={DiversionStyle}></div>
    <div className="grid-col-8">Not On Diversion<button className="usa-button--unstyled">Change status</button></div>
    </div>
        
        </div>
      </div>
      
    </div>
  );
};

export default Beds;
