import React, { useState } from 'react';
import { DateTime } from 'luxon';

import Counter from '../Components/Counter';
import Heading from '../Components/Heading';
import FormTextArea from '../Components/FormTextArea';

import DiversionPopup from '../Components/DiversionPopup';
import DiversionPopupConfirmation from '../Components/DiversionPopupConfirmation';

import './Beds.scss';

function Beds() {
  const [bedDateTime, setBedDateTime] = useState();

  const [notesDateTime, setNotesDateTime] = useState();
  const [additionalNotes, setAdditionalNotes] = useState();

  const [diversionDateTime, setDiversionDateTime] = useState();

  const [diversion, setDiversion] = useState(false);
  const [popup, setPopup] = useState(false);
  const [PopupConfirmation, setPopupConfirmation] = useState(false);

  const handleBedUpdate = () => {
    setBedDateTime(DateTime.local().toISO());
  };

  const handleNotesUpdate = () => {
    setNotesDateTime(DateTime.local().toISO());
  };

  const handleDiversionUpdate = () => {
    setDiversionDateTime(DateTime.local().toISO());
    setDiversion(!diversion);
    setPopup(!popup);
    setPopupConfirmation(!PopupConfirmation);
  };

  const container2 = {
    margin: '0.9em',
    padding: '0em',
    boxShadow: '0em 0em 0.4em gray',
  };

  const TogglePopup = () => {
    setPopup(!popup);
  };
  const TogglePopupConfirmation = () => {
    setPopupConfirmation(!PopupConfirmation);
  };
  return (
    <div className="usa-accordion">
      <Heading
        title="Bed availability"
        subtitle={`Updated ${bedDateTime ? DateTime.fromISO(bedDateTime).toFormat('M/d/yyyy @ H:mm') : '(pending)'}`}
      />
      <div className="usa-accordion__content">
        <div id="erCountButtons" className="usa-fieldset">
          <Counter CountTitle="ER Beds" update={handleBedUpdate} />
        </div>
        <div id="psychCountButtons" className="usa-fieldset">
          <Counter CountTitle="Psych Beds" update={handleBedUpdate} />
        </div>
      </div>

      <Heading
        title="Additional Notes"
        subtitle={`Updated ${notesDateTime ? DateTime.fromISO(notesDateTime).toFormat('M/d/yyyy @ H:mm') : '(pending)'}`}
      />
      <div className="usa-accordion__content">
        <form className="usa-form">
          <fieldset className="usa-fieldset beds__additional-notes">
            <FormTextArea
              label={
                <>
                  ER conditions <span>(optional)</span>
                </>
              }
              property="additionalNotes"
              value={additionalNotes}
              onChange={(property, value) => setAdditionalNotes(value)}
            />
            <div className="text-right">
              <button className="usa-button" type="button" onClick={handleNotesUpdate}>
                Update
              </button>
            </div>
          </fieldset>
        </form>
      </div>

      <Heading
        title="Diversion status"
        subtitle={`Updated ${diversionDateTime ? DateTime.fromISO(diversionDateTime).toFormat('M/d/yyyy @ H:mm') : '(pending)'}`}
      />
      <div className="usa-accordion__content">
        <div style={container2} className="usa-fieldset">
          <div className="grid-row height-7 width-card-lg">
            {!diversion && <div className="grid-col-1 beds_diversion_style" />}
            {!diversion && (
              <div className="grid-col-8 margin-1">
                Not On Diversion{popup}
                <button type="button" className="usa-button--unstyled" onClick={TogglePopup}>
                  Change status
                </button>
              </div>
            )}
            {diversion && <div className="grid-col-1 beds_diversion_style_2" />}
            {diversion && (
              <div className="grid-col-8 margin-1">
                On Diversion{popup}
                <button type="button" className="usa-button--unstyled" onClick={TogglePopup}>
                  Change status
                </button>
              </div>
            )}
            {popup && <DiversionPopup update={handleDiversionUpdate} keep={TogglePopup} />}
            {PopupConfirmation && <DiversionPopupConfirmation ok={TogglePopupConfirmation} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Beds;
