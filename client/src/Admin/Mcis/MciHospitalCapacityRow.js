import { useEffect, useRef, useState } from 'react';
import { DateTime } from 'luxon';
import classNames from 'classnames';

import { ReactComponent as NoteIcon } from '../../assets/img/icon-note.svg';
import MciCounter from '../../Components/MciCounter';

function MciHospitalCapacityRow({ onChange, ringdowns, showTotal, statusUpdate }) {
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
    timeoutRef.current = setTimeout(() => onChange(newInternalData), 350);
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
    <div className="mci-row">
      <div className="mci-row__status">
        <div className="mci-row__info">
          <h3 className={classNames('mci-row__name', { 'text-bold': !statusUpdate.hospitalId })}>{statusUpdate.hospitalName}</h3>
          <div className="mci-row__updated">
            {DateTime.fromISO(statusUpdate.updateDateTimeLocal).toLocaleString(DateTime.DATETIME_SHORT)}
          </div>
        </div>
        <div className="mci-row__controls">
          <MciCounter
            className="flex-1"
            isEditable={!!statusUpdate.hospitalId}
            label="Immediate"
            type="immediate"
            name="mciRedCapacity"
            value={internalData.mciRedCapacity}
            onChange={onChangeInternal}
          />
          <h2 className={classNames('margin-x-1', { 'opacity-0': !showTotal })}>+</h2>
          <MciCounter
            className="flex-1"
            isEditable={!!statusUpdate.hospitalId}
            label="Delayed"
            type="delayed"
            name="mciYellowCapacity"
            value={internalData.mciYellowCapacity}
            onChange={onChangeInternal}
          />
          <h2 className={classNames('margin-x-1', { 'opacity-0': !showTotal })}>+</h2>
          <MciCounter
            className="flex-1"
            isEditable={!!statusUpdate.hospitalId}
            label="Minor"
            type="minor"
            name="mciGreenCapacity"
            value={internalData.mciGreenCapacity}
            onChange={onChangeInternal}
          />
          <h2 className={classNames('margin-x-1', { 'opacity-0': !showTotal })}>=</h2>
          <MciCounter
            className={classNames('flex-1', { 'opacity-0': !showTotal })}
            label="Total"
            type="total"
            value={(internalData.mciRedCapacity ?? 0) + (internalData.mciYellowCapacity ?? 0) + (internalData.mciGreenCapacity ?? 0)}
          />
        </div>
      </div>
      <div className="mci-row__transported">
        <div className="mci-row__info">
          <h4 className="margin-y-0">Transported</h4>
        </div>
        <div className="mci-row__controls">
          <MciCounter className="flex-1" type="immediate" value={transportedTotals.red} />
          <h2 className={classNames('margin-x-1 margin-y-0', { 'opacity-0': !showTotal })}>+</h2>
          <MciCounter className="flex-1" type="delayed" value={transportedTotals.yellow} />
          <h2 className={classNames('margin-x-1 margin-y-0', { 'opacity-0': !showTotal })}>+</h2>
          <MciCounter className="flex-1" type="minor" value={transportedTotals.green} />
          <h2 className={classNames('margin-x-1 margin-y-0', { 'opacity-0': !showTotal })}>=</h2>
          <MciCounter
            className={classNames('flex-1', { 'opacity-0': !showTotal })}
            type="total"
            value={transportedTotals.red + transportedTotals.yellow + transportedTotals.green}
          />
        </div>
      </div>
      {statusUpdate.additionalServiceAvailabilityNotes && (
        <div className="mci-row__notes">
          <NoteIcon />
          <span className="margin-left-1">{statusUpdate.additionalServiceAvailabilityNotes}</span>
        </div>
      )}
    </div>
  );
}

export default MciHospitalCapacityRow;
