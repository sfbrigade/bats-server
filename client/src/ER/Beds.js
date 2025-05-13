import React, { useState } from 'react';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';

import ApiService from '../ApiService';

import Counter from '../Components/Counter';
import FormTextArea from '../Components/FormTextArea';
import Heading from '../Components/Heading';
import StickyFooter from '../Components/StickyFooter';
import HospitalStatus from '../Models/HospitalStatus';

import './Beds.scss';

function Beds({ hospital, showMci, statusUpdate, onStatusUpdate, incomingRingdownsCount }) {
  const [additionalNotes, setAdditionalNotes] = useState(null);
  const [isEditing, setEditing] = useState(false);

  function handleChange(event) {
    const newStatusUpdate = new HospitalStatus(statusUpdate);
    const m = event.target.name.match(/^customInventoryCount\[(\d+)\]$/);
    if (m) {
      newStatusUpdate.customInventoryCount ||= new Array(hospital.customInventory.length).fill(0);
      newStatusUpdate.customInventoryCount[parseInt(m[1], 10)] = parseInt(event.target.value, 10);
    } else {
      newStatusUpdate[event.target.name] = parseInt(event.target.value, 10);
    }
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
          {showMci && (
            <>
              <Heading title="MCI Capacity" />
              <fieldset className="usa-fieldset beds__availability">
                <Counter
                  className="beds__counter beds__counter--immediate"
                  isEditing={isEditing}
                  label="Immediate"
                  name="mciRedCapacity"
                  min={0}
                  onChange={handleChange}
                  value={statusUpdate.mciRedCapacity}
                />
                <Counter
                  className="beds__counter beds__counter--delayed"
                  isEditing={isEditing}
                  label="Delayed"
                  name="mciYellowCapacity"
                  min={0}
                  onChange={handleChange}
                  value={statusUpdate.mciYellowCapacity}
                />
                <Counter
                  className="beds__counter beds__counter--minor"
                  isEditing={isEditing}
                  label="Minor"
                  name="mciGreenCapacity"
                  min={0}
                  onChange={handleChange}
                  value={statusUpdate.mciGreenCapacity}
                />
              </fieldset>
            </>
          )}
          {hospital?.organization?.type === 'VENUE' && hospital.customInventory?.length && (
            <>
              <Heading title="Availability">
                <span className="beds__incoming">
                  <i className="fas fa-exclamation-circle" /> {incomingRingdownsCount} incoming
                </span>
              </Heading>
              {statusUpdate && (
                <fieldset className="usa-fieldset beds__availability">
                  {hospital.customInventory.map((label, i) => (
                    <Counter
                      key={`customInventoryCount-${i}`}
                      isEditing={isEditing}
                      label={label}
                      name={`customInventoryCount[${i}]`}
                      min={0}
                      onChange={handleChange}
                      value={statusUpdate.customInventoryCount?.[i] ?? 0}
                    />
                  ))}
                </fieldset>
              )}
            </>
          )}
          {hospital?.organization?.type !== 'VENUE' ||
            (!hospital.customInventory?.length && (
              <>
                <Heading title="Available Beds">
                  {incomingRingdownsCount > 0 && (
                    <span className="beds__incoming">
                      <i className="fas fa-exclamation-circle" /> {incomingRingdownsCount} incoming
                    </span>
                  )}
                </Heading>
                {statusUpdate && (
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
                )}
              </>
            ))}
          <Heading title="ER conditions" />
          {statusUpdate && (
            <>
              <fieldset className="usa-fieldset beds__notes">
                <FormTextArea
                  property="additionalNotes"
                  disabled={!isEditing}
                  value={additionalNotes == null ? statusUpdate.additionalServiceAvailabilityNotes : additionalNotes}
                  onChange={(property, value) => setAdditionalNotes(value)}
                />
              </fieldset>
              <StickyFooter className="usa-fieldset">
                {!isEditing ? (
                  <button className="usa-button usa-button--outline width-full" type="button" onClick={() => setEditing(true)}>
                    Update Hospital Info
                  </button>
                ) : (
                  <button className="usa-button width-full" type="button" onClick={handleUpdate}>
                    Confirm Updates
                  </button>
                )}
                <div className="beds__updated">
                  Last updated on {DateTime.fromISO(statusUpdate.updateDateTimeLocal).toLocaleString(DateTime.DATETIME_SHORT)}
                </div>
              </StickyFooter>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

Beds.propTypes = {
  hospital: PropTypes.object,
  onStatusUpdate: PropTypes.func.isRequired,
  statusUpdate: PropTypes.instanceOf(HospitalStatus),
  incomingRingdownsCount: PropTypes.number.isRequired,
};

Beds.defaultProps = {
  statusUpdate: undefined,
};

export default Beds;
