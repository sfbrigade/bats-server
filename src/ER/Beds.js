import React, { useState } from 'react';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';

import ApiService from '../ApiService';

import Counter from '../Components/Counter';
import FormTextArea from '../Components/FormTextArea';
import Heading from '../Components/Heading';
import HospitalStatus from '../Models/HospitalStatus';

import './Beds.scss';

function Beds({ statusUpdate, onStatusUpdate, incoming }) {
  const [additionalNotes, setAdditionalNotes] = useState(null);
  const [showNotesUpdated, setShowNotesUpdated] = useState(false);
  const [edit, setEdit] = useState(false);

  function handleChange(event) {
    const newStatusUpdate = new HospitalStatus(statusUpdate);
    if (event.target.name === 'erBedsCount') {
      newStatusUpdate.openEdBedCount = event.target.value;
    } else if (event.target.name === 'psychBedsCount') {
      newStatusUpdate.openPsychBedCount = event.target.value;
    }
    onStatusUpdate(newStatusUpdate);
  }

  function handleUpdate() {
    statusUpdate.updateDateTimeLocal = DateTime.local().toISO();
    if (additionalNotes !== null) {
      statusUpdate.additionalServiceAvailabilityNotes = additionalNotes;
      setAdditionalNotes(null);
      setShowNotesUpdated(true);
      setTimeout(() => {
        setShowNotesUpdated(false);
      }, 1000);
    }

    ApiService.hospitalStatuses.create(statusUpdate.toJSON());
    setEdit(false);
  }

  return (
    <div className="usa-accordion">
      <Heading title="Bed availability" />
      <span>Incoming {incoming}</span>
      <div className="usa-accordion__content">
        {edit ? (
          <form className="usa-form">
            <fieldset className="usa-fieldset beds__availability">
              <Counter label="ER Beds" name="erBedsCount" min={0} onChange={handleChange} value={statusUpdate.openEdBedCount} />
              <Counter
                label="Behavioral Beds"
                name="psychBedsCount"
                min={0}
                onChange={handleChange}
                value={statusUpdate.openPsychBedCount}
              />
            </fieldset>
          </form>
        ) : (
          <div>
            <div className="margin-1 padding-2 border-1px">
              ER Beds<span className="margin-left-9 padding-left-9 flex-align-end">{statusUpdate.openEdBedCount}</span>
            </div>
            <div className="margin-1 padding-2 border-1px">
              Behavioral Beds<span className="margin-left-9 padding-left-9 flex-align-end">{statusUpdate.openPsychBedCount}</span>
            </div>
          </div>
        )}
      </div>
      <Heading title="Additional Notes" />
      <div className="usa-accordion__content margin-1">
        {edit ? (
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
              </div>
            </fieldset>
          </form>
        ) : (
          <div className="border-1px padding-1 margin-y-6">{statusUpdate.additionalServiceAvailabilityNotes}</div>
        )}
        {!edit ? (
          <button type="button" className="usa-button margin-bottom-1" onClick={() => setEdit(true)}>
            Update Hospital Info
          </button>
        ) : (
          <button className="usa-button" type="button" onClick={handleUpdate}>
            edit
          </button>
        )}
        <div>Updated {DateTime.fromISO(statusUpdate.updateDateTimeLocal).toFormat('M/d/yyyy @ H:mm')}</div>
      </div>
    </div>
  );
}

Beds.propTypes = {
  onStatusUpdate: PropTypes.func.isRequired,
  statusUpdate: PropTypes.instanceOf(HospitalStatus).isRequired,
  incoming: PropTypes.number.isRequired,
};

export default Beds;
