import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DateTime } from 'luxon';

import ApiService from '../../ApiService';
import Alert from '../../Components/Alert';

import MciDetails from './MciDetails';
import MciPatientCounts from './MciPatientCounts';
import MciHospitalCapacity from './MciHospitalCapacity';

function Mci() {
  const { mciId } = useParams();
  const [data, setData] = useState();

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
          <MciDetails data={data} onEnd={onEnd} />
          <h2>Estimated Patient Counts</h2>
          <MciPatientCounts className="margin-bottom-4" data={data} isEditable={!data.endedAt} onChange={onChangeEstimatedPatientCounts} />
          {!data.endedAt && (
            <>
              <MciHospitalCapacity id={mciId} onError={setError} />
            </>
          )}
        </>
      )}
      {error && (
        <Alert type="error" title="An unexpected error has occurred" message={error.message} cancel="OK" onCancel={() => setError(null)} />
      )}
    </main>
  );
}

export default Mci;
