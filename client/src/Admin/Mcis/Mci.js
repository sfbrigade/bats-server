import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DateTime } from 'luxon';

import ApiService from '../../ApiService';
import Alert from '../../Components/Alert';

function Mci() {
  const { mciId } = useParams();
  const [data, setData] = useState();

  const [confirmEnd, setConfirmEnd] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    if (mciId) {
      ApiService.mcis.get(mciId).then((response) => setData(response.data));
    }
  }, [mciId]);

  async function onEnd() {
    try {
      const endedAt = DateTime.now().toISO();
      await ApiService.mcis.update(mciId, { endedAt });
      setData({ ...data, endedAt });
      setConfirmEnd(false);
    } catch (error) {
      setError(error);
    }
  }

  return (
    <main>
      <h1>MCI #{data?.incidentNumber}</h1>
      {data && (
        <>
          {data.address1 && <div>{data.address1}</div>}
          {data.address2 && <div>{data.address2}</div>}
          <div className="margin-bottom-1">
            <b>Started:</b> {DateTime.fromISO(data.startedAt).toLocaleString(DateTime.DATETIME_FULL)}
          </div>
          {data.endedAt && (
            <div className="margin-bottom-1">
              <b>Ended:</b> {DateTime.fromISO(data.endedAt).toLocaleString(DateTime.DATETIME_FULL)}
            </div>
          )}
          <div className="usa-form-group">
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
              onDestructive={onEnd}
              onCancel={() => setConfirmEnd(false)}
            />
          )}
          {error && (
            <Alert
              type="error"
              title="An unexpected error has occurred"
              message={error.message}
              cancel="OK"
              onCancel={() => setError(null)}
            />
          )}
        </>
      )}
    </main>
  );
}

export default Mci;
