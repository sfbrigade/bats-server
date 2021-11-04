import React, { useState } from 'react';
import { DateTime } from 'luxon';
// import classNames from 'classnames';
import PropTypes from 'prop-types';

import ApiService from '../ApiService';

// import Alert from '../Components/Alert';
import Counter from '../Components/Counter';
import FormTextArea from '../Components/FormTextArea';
import Heading from '../Components/Heading';
import HospitalStatus from '../Models/HospitalStatus';

import './Beds.scss';

function Beds({ statusUpdate, onStatusUpdate }) {
  const [additionalNotes, setAdditionalNotes] = useState(null);
  const [showNotesUpdated, setShowNotesUpdated] = useState(false);
  // const [showUpdate, setShowUpdate] = useState(false);
  // const [showConfirmUpdate, setShowConfirmUpdate] = useState(false);
  const [editBeds, setEditBeds] = useState(false);
  const [editNotes, setEditNotes] = useState(false);

  function handleBedUpdate(event) {
    const newStatusUpdate = new HospitalStatus(statusUpdate);
    newStatusUpdate.updateDateTimeLocal = DateTime.local().toISO();
    newStatusUpdate.bedCountUpdateDateTimeLocal = newStatusUpdate.updateDateTimeLocal;
    if (event.target.name === 'erBedsCount') {
      newStatusUpdate.openEdBedCount = event.target.value;
    } else if (event.target.name === 'psychBedsCount') {
      newStatusUpdate.openPsychBedCount = event.target.value;
    }
    onStatusUpdate(newStatusUpdate);
    ApiService.hospitalStatuses.create(newStatusUpdate.toJSON());
  }

  function handleNotesUpdate() {
    const newStatusUpdate = new HospitalStatus(statusUpdate);
    newStatusUpdate.updateDateTimeLocal = DateTime.local().toISO();
    newStatusUpdate.notesUpdateDateTimeLocal = newStatusUpdate.updateDateTimeLocal;
    newStatusUpdate.additionalServiceAvailabilityNotes = additionalNotes;
    onStatusUpdate(newStatusUpdate);
    ApiService.hospitalStatuses.create(newStatusUpdate.toJSON());
    setAdditionalNotes(null);
    setShowNotesUpdated(true);
    setTimeout(() => {
      setShowNotesUpdated(false);
    }, 1000);
    setEditNotes(false);
  }

  // function handleDiversionUpdate() {
  //   const newStatusUpdate = new HospitalStatus(statusUpdate);
  //   newStatusUpdate.updateDateTimeLocal = DateTime.local().toISO();
  //   newStatusUpdate.divertStatusUpdateDateTimeLocal = newStatusUpdate.updateDateTimeLocal;
  //   newStatusUpdate.divertStatusIndicator = !newStatusUpdate.divertStatusIndicator;
  //   onStatusUpdate(newStatusUpdate);
  //   ApiService.hospitalStatuses.create(newStatusUpdate.toJSON());
  //   setShowUpdate(false);
  //   setShowConfirmUpdate(true);
  // }

  return (
    <div className="usa-accordion">
      <Heading
        title="Bed availability"
        subtitle={`Updated ${DateTime.fromISO(statusUpdate.bedCountUpdateDateTimeLocal).toFormat('M/d/yyyy @ H:mm')}`}
        buttonTitle={editBeds ? 'Confirm' : 'Edit'}
        readOnly={() => setEditBeds(!editBeds)}
      />
      <div className="usa-accordion__content">
        <form className="usa-form">
          {editBeds ? (
            <fieldset className="usa-fieldset beds__availability">
              <Counter label="ER Beds" name="erBedsCount" min={0} onChange={handleBedUpdate} value={statusUpdate.openEdBedCount} />
              <Counter
                label="Behavioral Beds"
                name="psychBedsCount"
                min={0}
                onChange={handleBedUpdate}
                value={statusUpdate.openPsychBedCount}
              />
            </fieldset>
          ) : (
            <div>
              <div className="margin-3">
                ER Beds<span className="margin-left-205">{statusUpdate.openEdBedCount}</span>
              </div>
              <div className="margin-3">
                Behavioral Beds<span className="margin-left-205">{statusUpdate.openPsychBedCount}</span>
              </div>
            </div>
          )}
        </form>
      </div>
      <Heading
        title="Additional Notes"
        subtitle={`Updated ${DateTime.fromISO(statusUpdate.notesUpdateDateTimeLocal).toFormat('M/d/yyyy @ H:mm')}`}
        buttonTitle={editNotes ? undefined : 'Edit'}
        readOnly={() => setEditNotes(true)}
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
              value={additionalNotes == null ? statusUpdate.additionalServiceAvailabilityNotes : additionalNotes}
              onChange={(property, value) => setAdditionalNotes(value)}
              readOnly={editNotes}
            />
            <div className="beds__notes-controls">
              <span className="beds__updated">
                {showNotesUpdated && (
                  <>
                    <i className="fas fa-check-circle" />
                    &nbsp;Updated
                  </>
                )}
              </span>
              <button disabled={additionalNotes == null} className="usa-button" type="button" onClick={handleNotesUpdate}>
                Update
              </button>
            </div>
          </fieldset>
        </form>
      </div>

      {/* <Heading
        title="Diversion status"
        subtitle={`Updated ${DateTime.fromISO(statusUpdate.divertStatusUpdateDateTimeLocal).toFormat('M/d/yyyy @ H:mm')}`}
      /> */}
      <div className="usa-accordion__content hide-diversion-status">
        <div className="usa-fieldset">
          <div className={classNames('beds__diversion', { 'beds__diversion--on': statusUpdate.divertStatusIndicator })}>
            {statusUpdate.divertStatusIndicator && <>On diversion</>}
            {!statusUpdate.divertStatusIndicator && <>Not on diversion</>}
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
      </div> */}
    </div>
  );
}

Beds.propTypes = {
  onStatusUpdate: PropTypes.func.isRequired,
  statusUpdate: PropTypes.instanceOf(HospitalStatus).isRequired,
};

export default Beds;
