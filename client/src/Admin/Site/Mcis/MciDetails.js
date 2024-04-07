import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DateTime } from 'luxon';

import Alert from '../../../Components/Alert';

function MciDetails({ data, onEnd }) {
  const [confirmEnd, setConfirmEnd] = useState(false);

  function onEndInternal() {
    setConfirmEnd(false);
    onEnd();
  }

  return (
    <>
      {data.address1 && <div className="margin-bottom-1">{data.address1}</div>}
      {data.address2 && <div className="margin-bottom-1">{data.address2}</div>}
      <div className="margin-bottom-1">
        <b>Started:</b> {DateTime.fromISO(data.startedAt).toLocaleString(DateTime.DATETIME_FULL)}
      </div>
      {data.endedAt && (
        <div className="margin-bottom-1">
          <b>Ended:</b> {DateTime.fromISO(data.endedAt).toLocaleString(DateTime.DATETIME_FULL)}
        </div>
      )}
      <div className="margin-top-2 margin-bottom-3">
        {!data.endedAt && (
          <button onClick={() => setConfirmEnd(true)} className="usa-button usa-button--secondary">
            End MCI
          </button>
        )}
        <Link to="edit" className="usa-button usa-button--primary">
          Edit
        </Link>
      </div>
      {confirmEnd && (
        <Alert
          type="warning"
          title="End MCI?"
          message="Are you sure you wish to end this MCI?"
          destructive="Yes"
          cancel="No"
          onDestructive={onEndInternal}
          onCancel={() => setConfirmEnd(false)}
        />
      )}
    </>
  );
}

export default MciDetails;
