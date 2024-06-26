import { useEffect, useState } from 'react';

import ApiService from '../../ApiService';

import RingdownCard from '../../Components/RingdownCard';

import MciDetails from './MciDetails';
import MciPatientCounts from './MciPatientCounts';
import Ringdown from '../../Models/Ringdown';

function MciEnded({ data }) {
  const [ringdowns, setRingdowns] = useState();

  useEffect(() => {
    const { id } = data ?? {};
    if (id) {
      ApiService.mcis.ringdowns(id).then((response) => {
        let ringdowns = response.data.map((r) => new Ringdown(r));
        ringdowns.sort((a, b) => {
          return a.triagePrioritySort - b.triagePrioritySort;
        });
        setRingdowns(ringdowns);
      });
    }
  }, [data]);

  return (
    <>
      <MciDetails data={data} />
      <h2>Estimated Patient Counts</h2>
      <MciPatientCounts className="margin-bottom-4" data={data} ringdowns={ringdowns} showTransported />
      <h2 className="margin-top-4">Transported Patients</h2>
      {ringdowns?.map((r) => (
        <RingdownCard className="margin-bottom-2" ringdown={r} />
      ))}
    </>
  );
}

export default MciEnded;
