import React, { useState } from 'react';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';

import ApiService from '../ApiService';

import Counter from '../Components/Counter';
import FormTextArea from '../Components/FormTextArea';
import Heading from '../Components/Heading';
import HospitalStatus from '../Models/HospitalStatus';

import './Beds.scss';

function Beds({ statusUpdate, onStatusUpdate, incomingRingdownsCount }) {
  const [additionalNotes, setAdditionalNotes] = useState(null);
  const [isEditing, setEditing] = useState(false);

  function handleChange(event) {
    const newStatusUpdate = new HospitalStatus(statusUpdate);
    newStatusUpdate[event.target.name] = parseInt(event.target.value, 10);
    onStatusUpdate(newStatusUpdate);
  }

  function handleUpdate() {
    statusUpdate.updateDateTimeLocal = DateTime.local().toISO();
    if (additionalNotes !== null) {
      statusUpdate.additionalServiceAvailabilityNotes = additionalNotes;
      setAdditionalNotes(null);
    }

    ApiService.hospitalStatuses.create(statusUpdate.toJSON());
    setEditing(false);
  }

  return (
    <div className="usa-accordion beds">
      <div className="usa-accordion__content">
        <form className="usa-form">
          <Heading title="Available Beds">
            {incomingRingdownsCount > 0 && (
              <span className="beds__incoming">
                <i className="fas fa-exclamation-circle" /> {incomingRingdownsCount} incoming
              </span>
            )}
          </Heading>
          <fieldset className="usa-fieldset beds__availability">
            <Counter
              isEditing={isEditing}
              label="ER Beds"
              name="openEdBedCount"
              min={0}
              onChange={handleChange}
              value={statusUpdate.openEdBedCount}
            />
            <Counter
              isEditing={isEditing}
              label="Behavioral Beds"
              name="openPsychBedCount"
              min={0}
              onChange={handleChange}
              value={statusUpdate.openPsychBedCount}
            />
          </fieldset>
          <Heading title="ER conditions" />
          <fieldset className="usa-fieldset beds__notes">
            <FormTextArea
              property="additionalNotes"
              disabled={!isEditing}
              value={additionalNotes == null ? statusUpdate.additionalServiceAvailabilityNotes : additionalNotes}
              onChange={(property, value) => setAdditionalNotes(value)}
            />
            {!isEditing ? (
              <button className="usa-button usa-button--outline" type="button" onClick={() => setEditing(true)}>
                Update Hospital Info
              </button>
            ) : (
              <button className="usa-button" type="button" onClick={handleUpdate}>
                Confirm Updates
              </button>
            )}
            <div className="beds__updated">Updated {DateTime.fromISO(statusUpdate.updateDateTimeLocal).toFormat('M/d/yyyy @ H:mm')}</div>
          </fieldset>
        </form>
      </div>
    </div>
  );
}

Beds.propTypes = {
  onStatusUpdate: PropTypes.func.isRequired,
  statusUpdate: PropTypes.instanceOf(HospitalStatus).isRequired,
  incomingRingdownsCount: PropTypes.number.isRequired,
};

export default Beds;
