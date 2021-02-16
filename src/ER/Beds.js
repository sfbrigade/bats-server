import React, { useState } from 'react';
import Counter from '../Components/Counter';
import Banner from '../Components/Banner';
import ButtonRight from '../Components/ButtonRight';
import DiversionPopup from '../Components/DiversionPopup';
import DiversionPopupConfirmation from '../Components/DiversionPopupConfirmation';
import './Beds.css';

const Beds = () => {
 

  const [BedTimeBanner, setBedTimeUpdate] = useState("pending");
  const [BedDateBanner, setBedDateUpdate] = useState("pending");
  const [NotesTimeBanner, setNotesTimeUpdate] = useState("pending");
  const [NotesDateBanner, setNotesDateUpdate] = useState("pending");
  const [DiversionTimeBanner, setDiversionTimeUpdate] = useState("19:09:35");
  const [DiversionDateBanner, setDiversionDateUpdate] = useState("11/29/2020");
  const [diversion, setDiversion] = useState(false);
  const [popup, setPopup] = useState(false);
  const [PopupConfirmation, setPopupConfirmation] = useState(false);

  const handleBedUpdate = () => {
    const date = new Date();
    const DateString = date.toString();
    const DateArray = DateString.split(' ');
    const TimeString = date.toTimeString();
    const TimeArray = TimeString.split(' ');
    setBedTimeUpdate(TimeArray[0]);
    setBedDateUpdate(date.getMonth() + 1 + "/" + DateArray[2] + "/" + DateArray[3]);


  }

  const handleNotesUpdate = () => {
    const date = new Date();
    const DateString = date.toString();
    const DateArray = DateString.split(' ');
    const TimeString = date.toTimeString();
    const TimeArray = TimeString.split(' ');
    setNotesTimeUpdate(TimeArray[0]);
    setNotesDateUpdate(date.getMonth() + 1 + "/" + DateArray[2] + "/" + DateArray[3]);
  }

  const handleDiversionUpdate = () => {
    
    const date = new Date();
    const DateString = date.toString();
    const DateArray = DateString.split(' ');
    const TimeString = date.toTimeString();
    const TimeArray = TimeString.split(' ');
    setDiversionTimeUpdate(TimeArray[0]);
    setDiversionDateUpdate(date.getMonth() + 1 + "/" + DateArray[2] + "/" + DateArray[3]);
    setDiversion(!diversion);
    setPopup(!popup);
    setPopupConfirmation(!PopupConfirmation);

  }

  const container = {
    "margin": "0.7em",
    "padding": "0.7em"
}
const container2 = {
  "margin": "0.9em",
  "padding": "0em",
  "boxShadow": "0em 0em 0.4em gray"
}

const TogglePopup = () => {
  setPopup(!popup)
}
const TogglePopupConfirmation = () => {
  setPopupConfirmation(!PopupConfirmation)
}
  return (
    <div className="usa-accordion">
      
      <Banner BannerTitle="Bed availability" date={BedDateBanner} time={BedTimeBanner} />
    
      <div className="usa-accordion__content">
        <div id="erCountButtons" className="usa-fieldset">
          <Counter CountTitle="ER Beds" update={handleBedUpdate} />
        </div>
        <div id="psychCountButtons" className="usa-fieldset">
        <Counter CountTitle="Psych Beds" update={handleBedUpdate} />
         </div>

         
        <Banner BannerTitle="Addtl. Notes (optional)" date={NotesDateBanner} time={NotesTimeBanner} />
     
        <div style={container} className="usa-fieldset">
          <label htmlFor="erNotes">
          ER conditions
            <textarea id="erNotes" name="erNotes" rows="4" cols="50" require="true" />
          </label>
          <ButtonRight ButtonTitle="Update" update={handleNotesUpdate} />   
        </div>

      
          <Banner BannerTitle="Diversion status" date={DiversionDateBanner} time={DiversionTimeBanner} />
      
          <div style={container2} className="usa-fieldset">
          <div className="grid-row height-7 width-card-lg">
    {!diversion && <div className="grid-col-1 Beds_DiversionStyle" ></div>}
    {!diversion && <div className="grid-col-8">Not On Diversion{popup}<button className="usa-button--unstyled" onClick={TogglePopup}>Change status</button></div>}
    {diversion && <div className="grid-col-1 Beds_DiversionStyle2" ></div>}
    {diversion && <div className="grid-col-8">On Diversion{popup}<button className="usa-button--unstyled" onClick={TogglePopup}>Change status</button></div>}
    {popup && <DiversionPopup update={handleDiversionUpdate} keep={TogglePopup} />}
    {PopupConfirmation && <DiversionPopupConfirmation ok={TogglePopupConfirmation} />}
    </div>
        
        </div>
      </div>
      
    </div>
  );
};

export default Beds;
