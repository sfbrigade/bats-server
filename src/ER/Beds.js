import React, { useState } from 'react';
import { DateTime } from 'luxon';
import classNames from 'classnames';

import Alert from '../Components/Alert';
import Counter from '../Components/Counter';
import FormTextArea from '../Components/FormTextArea';
import Heading from '../Components/Heading';

import './Beds.scss';

function Beds() {
  const [bedDateTime, setBedDateTime] = useState();

  const [notesDateTime, setNotesDateTime] = useState();
  const [additionalNotes, setAdditionalNotes] = useState();

  const [diversionDateTime, setDiversionDateTime] = useState();

  const [onDiversion, setOnDiversion] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showConfirmUpdate, setShowConfirmUpdate] = useState(false);

  const handleBedUpdate = () => {
    setBedDateTime(DateTime.local().toISO());
  };

  const handleNotesUpdate = () => {
    setNotesDateTime(DateTime.local().toISO());
  };

  const handleDiversionUpdate = () => {
    setDiversionDateTime(DateTime.local().toISO());
    setOnDiversion(!onDiversion);
    setShowUpdate(false);
    setShowConfirmUpdate(true);
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
        <div className="usa-fieldset">
          <div className={classNames('beds__diversion', { 'beds__diversion--on': onDiversion })}>
            {onDiversion && <>On diversion</>}
            {!onDiversion && <>Not on diversion</>}
            <button type="button" className="usa-button--unstyled beds__change-status" onClick={() => setShowUpdate(true)}>
              Change status
            </button>
            {showUpdate && (
              <Alert
                type="warning"
                title="Update divert status?"
                message="Ambulances will be notified."
                cancel="Keep status"
                destructive="Update status"
                onDestructive={handleDiversionUpdate}
                onCancel={() => setShowUpdate(false)}
              />
            )}
            {showConfirmUpdate && (
              <Alert
                type="success"
                title="Divert status updated"
                message="Ambulances will be notified."
                primary="Return to form"
                onPrimary={() => setShowConfirmUpdate(false)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Beds;
