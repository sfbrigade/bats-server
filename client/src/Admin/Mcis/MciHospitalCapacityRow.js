import { useState } from 'react';
import { DateTime } from 'luxon';

import { ReactComponent as NoteIcon } from '../../assets/img/icon-note.svg';
import MciCounter from '../../Components/MciCounter';

import './MciHospitalCapacityRow.scss';

function MciHospitalCapacityRow({ statusUpdate }) {
  const [internalData, setInternalData] = useState(statusUpdate.toJSON());

  function onChangeInternal(event) {
    const newInternalData = { ...internalData };
    newInternalData[event.target.name] = event.target.value;
    setInternalData(newInternalData);
  }

  return (
    <div className="mci-hospital-capacity-row">
      <div className="mci-hospital-capacity-row__status">
        <div className="mci-hospital-capacity-row__info">
          <h3 className="mci-hospital-capacity-row__name">{statusUpdate.hospitalName}</h3>
          <div className="mci-hospital-capacity-row__updated">
            {DateTime.fromISO(statusUpdate.updateDateTimeLocal).toLocaleString(DateTime.DATETIME_SHORT)}
          </div>
        </div>
        <div className="mci-hospital-capacity-row__controls">
          <MciCounter
            className="flex-1"
            isEditable
            label="Immediate"
            type="immediate"
            name="mciRedCapacity"
            value={internalData.mciRedCapacity}
            onChange={onChangeInternal}
          />
          <MciCounter
            className="flex-1"
            isEditable
            label="Delayed"
            type="delayed"
            name="mciYellowCapacity"
            value={internalData.mciYellowCapacity}
            onChange={onChangeInternal}
          />
          <MciCounter
            className="flex-1"
            isEditable
            label="Minor"
            type="minor"
            name="mciGreenCapacity"
            value={internalData.mciGreenCapacity}
            onChange={onChangeInternal}
          />
        </div>
      </div>
      {statusUpdate.additionalServiceAvailabilityNotes && (
        <div className="mci-hospital-capacity-row__notes">
          <NoteIcon />
          <span className="margin-left-1">{statusUpdate.additionalServiceAvailabilityNotes}</span>
        </div>
      )}
    </div>
  );
}

export default MciHospitalCapacityRow;
