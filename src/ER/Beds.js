import React, { useState } from 'react';
import { DateTime } from 'luxon';
import classNames from 'classnames';

import Alert from '../Components/Alert';
import Counter from '../Components/Counter';
import FormTextArea from '../Components/FormTextArea';
import Heading from '../Components/Heading';

import CheckIcon from './checkIcon.png';

import './Beds.scss';

function Beds() {
  const [bedDateTime, setBedDateTime] = useState();
  const [erBedsCount, setErBedsCount] = useState(0);
  const [psychBedsCount, setPsychBedsCount] = useState(0);

  const [notesDateTime, setNotesDateTime] = useState();
  const [additionalNotes, setAdditionalNotes] = useState();
  const [updatedNotes, setUpdatedNotes] = useState(false);

  const [diversionDateTime, setDiversionDateTime] = useState();

  const [onDiversion, setOnDiversion] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showConfirmUpdate, setShowConfirmUpdate] = useState(false);

  function handleBedUpdate(event) {
    setBedDateTime(DateTime.local().toISO());
    if (event.target.name === 'erBedsCount') {
      setErBedsCount(event.target.value);
    } else if (event.target.name === 'psychBedsCount') {
      setPsychBedsCount(event.target.value);
    }
  }

  function handleNotesUpdate() {
    setNotesDateTime(DateTime.local().toISO());
    setUpdatedNotes(true);
  }

  function handleDiversionUpdate() {
    setDiversionDateTime(DateTime.local().toISO());
    setOnDiversion(!onDiversion);
    setShowUpdate(false);
    setShowConfirmUpdate(true);
  }

  return (
    <div className="usa-accordion">
      <Heading
        title="Bed availability"
        subtitle={`Updated ${bedDateTime ? DateTime.fromISO(bedDateTime).toFormat('M/d/yyyy @ H:mm') : '(pending)'}`}
      />
      <div className="usa-accordion__content">
        <form className="usa-form">
          <fieldset className="usa-fieldset beds__availability">
            <Counter label="ER Beds" name="erBedsCount" min={0} onChange={handleBedUpdate} value={erBedsCount} />
            <Counter label="Psych Beds" name="psychBedsCount" min={0} onChange={handleBedUpdate} value={psychBedsCount} />
          </fieldset>
        </form>
      </div>
      <Heading
        title="Additional Notes"
        subtitle={`Updated ${notesDateTime ? DateTime.fromISO(notesDateTime).toFormat('M/d/yyyy @ H:mm') : '(pending)'}`}
      />
      <div className="usa-accordion__content">
        <form className="usa-form">
          <fieldset className="usa-fieldset beds__notes">
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
              {updatedNotes && (
                <span className="beds__updated">
                  <img className="beds__check-icon" src={CheckIcon} alt="check icon" width="25" height="30" />
                  Updated
                </span>
              )}
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
