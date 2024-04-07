import Spinner from '../../../Components/Spinner';

import MciPatientCounts from './MciPatientCounts';

function MciTransportedCounts({ ringdowns }) {
  let transportedTotals = {
    estimatedRedCount: 0,
    estimatedYellowCount: 0,
    estimatedGreenCount: 0,
  };
  ringdowns?.forEach((rd) => {
    switch (rd.triagePriority) {
      case 'RED':
        transportedTotals.estimatedRedCount += 1;
        break;
      case 'YELLOW':
        transportedTotals.estimatedYellowCount += 1;
        break;
      case 'GREEN':
        transportedTotals.estimatedGreenCount += 1;
        break;
      default:
        break;
    }
  });
  return (
    <>
      {!ringdowns && <Spinner />}
      {ringdowns && <MciPatientCounts className="margin-bottom-3" data={transportedTotals} isEditable={false} />}
    </>
  );
}

export default MciTransportedCounts;
