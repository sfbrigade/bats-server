import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import ApiService from '../../../ApiService';
import Alert from '../../../Components/Alert';

import MciActive from './MciActive';
import MciEnded from './MciEnded';

function Mci() {
  const { mciId } = useParams();
  const [data, setData] = useState();

  const [error, setError] = useState();

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
          {!!data.endedAt && <MciEnded data={data} />}
          {!data.endedAt && <MciActive id={mciId} onEnd={setData} onError={setError} />}
        </>
      )}
      {error && (
        <Alert type="error" title="An unexpected error has occurred" message={error.message} cancel="OK" onCancel={() => setError(null)} />
      )}
    </main>
  );
}

export default Mci;
