import { useEffect, useRef, useState } from 'react';
import { DateTime } from 'luxon';

import { ReactComponent as NoteIcon } from '../../assets/img/icon-note.svg';
import MciCounter from '../../Components/MciCounter';

import './MciHospitalCapacityRow.scss';

function MciHospitalCapacityRow({ onChange, ringdowns, statusUpdate }) {
  const timeoutRef = useRef();
  const [internalData, setInternalData] = useState(statusUpdate.toJSON());

  useEffect(() => {
    setInternalData(statusUpdate);
  }, [statusUpdate]);

  function onChangeInternal(event) {
    clearTimeout(timeoutRef.current);
    const newInternalData = { ...internalData };
    newInternalData[event.target.name] = event.target.value;
    setInternalData(newInternalData);
    timeoutRef.current = setTimeout(() => onChange(newInternalData), 250);
  }

  const transportedTotals = {
    red: 0,
    yellow: 0,
    green: 0,
  };
  ringdowns.forEach((rd) => {
    if (rd.hospitalId === statusUpdate.hospitalId) {
      switch (rd.triagePriority) {
        case 'RED':
          transportedTotals.red += 1;
          break;
        case 'YELLOW':
          transportedTotals.yellow += 1;
          break;
        case 'GREEN':
          transportedTotals.green += 1;
          break;
        default:
          break;
      }
    }
  });

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
      <div className="mci-hospital-capacity-row__transported">
        <div className="mci-hospital-capacity-row__info">
          <h4 className="margin-y-0">Transported</h4>
        </div>
        <div className="mci-hospital-capacity-row__controls">
          <MciCounter className="flex-1" type="immediate" value={transportedTotals.red} />
          <MciCounter className="flex-1" type="delayed" value={transportedTotals.yellow} />
          <MciCounter className="flex-1" type="minor" value={transportedTotals.green} />
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
