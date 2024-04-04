import Spinner from '../../Components/Spinner';

import MciPatientCounts from './MciPatientCounts';

function MciTransportedCounts({ ringdowns }) {
  let transportedTotals;
  ringdowns?.forEach((rd) => {
    transportedTotals = transportedTotals ?? {
      estimatedRedCount: 0,
      estimatedYellowCount: 0,
      estimatedGreenCount: 0,
    };
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
      {!transportedTotals && <Spinner />}
      {transportedTotals && <MciPatientCounts className="margin-bottom-3" data={transportedTotals} isEditable={false} />}
    </>
  );
}

export default MciTransportedCounts;
