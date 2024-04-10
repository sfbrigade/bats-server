import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { DateTime } from 'luxon';
import classNames from 'classnames';

import Alert from '../../Components/Alert';
import MciCounter from '../../Components/MciCounter';

function MciPatientCounts({ className, data, isEditable, onChange, onEnd, ringdowns, showEnd, showTransported }) {
  const timeoutRef = useRef();
  const [internalData, setInternalData] = useState(data);
  const [confirmEnd, setConfirmEnd] = useState(false);

  useEffect(() => {
    setInternalData(data);
  }, [data]);

  function onChangeInternal(event) {
    clearTimeout(timeoutRef.current);
    const newInternalData = { ...internalData };
    newInternalData[event.target.name] = event.target.value;
    setInternalData(newInternalData);
    timeoutRef.current = setTimeout(() => onChange(newInternalData), 350);
  }

  function onEndInternal() {
    setConfirmEnd(false);
    onEnd(data.id);
  }

  const estimatedTotal =
    internalData.estimatedRedCount +
    internalData.estimatedYellowCount +
    internalData.estimatedGreenCount +
    internalData.estimatedZebraCount;

  let transportedTotals = {
    red: 0,
    yellow: 0,
    green: 0,
    zebra: 0,
  };
  ringdowns?.forEach((rd) => {
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
      case 'ZEBRA':
        transportedTotals.zebra += 1;
        break;
      default:
        break;
    }
  });

  return (
    <div className={classNames('mci-row', className)}>
      <div className="mci-row__header">
        {!!data.incidentNumber && (
          <h2 className="mci-row__name">
            <Link to={`/admin/mcis/${data.id}`}>#{data.incidentNumber}</Link>{' '}
            {data.address1 && (
              <span className="margin-left-105">
                {data.address1}
                {data.address2 && `, ${data.address2}`}
              </span>
            )}
          </h2>
        )}
        {!data.incidentNumber && <h3 className="mci-row__name text-bold">All MCIs</h3>}
        <div className="mci-row__updated">{DateTime.fromISO(data.updatedAt).toLocaleString(DateTime.DATETIME_SHORT)}</div>
      </div>
      <div className="mci-row__status">
        <div className="mci-row__controls">
          <MciCounter className="flex-1" label="Total" type="total" value={estimatedTotal} />
          <h2 className="margin-x-1">=</h2>
          <MciCounter
            className="flex-1"
            isEditable={isEditable}
            label="Immediate"
            type="immediate"
            name="estimatedRedCount"
            value={internalData.estimatedRedCount}
            onChange={onChangeInternal}
          />
          <h2 className="margin-x-1">+</h2>
          <MciCounter
            className="flex-1"
            isEditable={isEditable}
            label="Delayed"
            type="delayed"
            name="estimatedYellowCount"
            value={internalData.estimatedYellowCount}
            onChange={onChangeInternal}
          />
          <h2 className="margin-x-1">+</h2>
          <MciCounter
            className="flex-1"
            isEditable={isEditable}
            label="Minor"
            type="minor"
            name="estimatedGreenCount"
            value={internalData.estimatedGreenCount}
            onChange={onChangeInternal}
          />
          <h2 className="margin-x-1">+</h2>
          <MciCounter
            className="flex-1"
            isEditable={isEditable}
            label="Dead"
            type="dead"
            name="estimatedZebraCount"
            value={internalData.estimatedZebraCount}
            onChange={onChangeInternal}
          />
        </div>
      </div>
      {!!showTransported && (
        <div className="mci-row__transported">
          <div className="mci-row__controls">
            <h3 className="margin-y-0 flex-1">Transported</h3>
            <h2 className="margin-x-1 margin-y-0 opacity-0">+</h2>
            <MciCounter className="flex-1" type="immediate" value={transportedTotals.red} />
            <h2 className="margin-x-1 margin-y-0 opacity-0">+</h2>
            <MciCounter className="flex-1" type="delayed" value={transportedTotals.yellow} />
            <h2 className="margin-x-1 margin-y-0 opacity-0">+</h2>
            <MciCounter className="flex-1" type="minor" value={transportedTotals.green} />
            <h2 className="margin-x-1 margin-y-0 opacity-0">=</h2>
            <div className="flex-1 text-right">
              {!!showEnd && (
                <button onClick={() => setConfirmEnd(true)} className="usa-button usa-button--outline usa-button--secondary margin-left-1">
                  End MCI
                </button>
              )}{' '}
            </div>
          </div>
        </div>
      )}
      {confirmEnd && (
        <Alert
          type="warning"
          title="End MCI?"
          message={`Are you sure you wish to end MCI #${data.incidentNumber}?`}
          destructive="Yes"
          cancel="No"
          onDestructive={onEndInternal}
          onCancel={() => setConfirmEnd(false)}
        />
      )}
    </div>
  );
}

export default MciPatientCounts;
