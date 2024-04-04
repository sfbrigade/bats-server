import MciDetails from './MciDetails';
import MciPatientCounts from './MciPatientCounts';

function MciEnded({ data }) {
  return (
    <>
      <MciDetails data={data} />
      <h2>Estimated Patient Counts</h2>
      <MciPatientCounts className="margin-bottom-4" data={data} />
    </>
  );
}

export default MciEnded;
