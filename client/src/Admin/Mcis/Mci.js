import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ApiService from '../../ApiService';
import { DateTime } from 'luxon';

function Mci() {
  const { mciId } = useParams();
  const [data, setData] = useState();

  useEffect(() => {
    if (mciId) {
      ApiService.mcis.get(mciId).then((response) => setData(response.data));
    }
  }, [mciId]);

  return (
    <main>
      <h1>MCI #{data?.incidentNumber}</h1>
      {data && (
        <>
          {data.address1 && <div>{data.address1}</div>}
          {data.address2 && <div>{data.address2}</div>}
          <div>
            <b>Started:</b> {DateTime.fromISO(data.startedAt).toLocaleString(DateTime.DATETIME_FULL)}
          </div>
          {data.endedAt && (
            <div>
              <b>Ended:</b> {DateTime.fromISO(data.endedAt).toLocaleString(DateTime.DATETIME_FULL)}
            </div>
          )}
          <div className="usa-form-group">
            {!data.endedAt && <button className="usa-button usa-button--secondary">End MCI</button>}
            <Link to="edit" className="usa-button usa-button--primary">
              Edit
            </Link>
          </div>
        </>
      )}
    </main>
  );
}

export default Mci;
