import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DateTime } from 'luxon';

import ApiService from '../../ApiService';
import Alert from '../../Components/Alert';
import MciEstimatedPatientCounts from './MciEstimatedPatientCounts';

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

  async function onChangeEstimatedPatientCounts(newData) {
    try {
      const { estimatedRedCount, estimatedYellowCount, estimatedGreenCount, estimatedZebraCount } = newData;
      await ApiService.mcis.update(mciId, { estimatedRedCount, estimatedYellowCount, estimatedGreenCount, estimatedZebraCount });
      setData({ ...data, estimatedRedCount, estimatedYellowCount, estimatedGreenCount, estimatedZebraCount });
    } catch (error) {
      setError(error);
    }
  }

  return (
    <main>
      <h1>MCI #{data?.incidentNumber}</h1>
      {data && (
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
          <h2>Estimated Patient Counts</h2>
          <MciEstimatedPatientCounts data={data} onChange={onChangeEstimatedPatientCounts} />
        </>
      )}
    </main>
  );
}

export default Mci;
