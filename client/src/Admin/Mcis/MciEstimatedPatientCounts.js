import { useRef, useState } from 'react';
import MciCounter from '../../Components/MciCounter';

function MciEstimatedPatientCounts({ data, onChange }) {
  const timeoutRef = useRef();
  const [internalData, setInternalData] = useState(data);

  function onChangeInternal(event) {
    clearTimeout(timeoutRef.current);
    const newInternalData = { ...internalData };
    newInternalData[event.target.name] = event.target.value;
    setInternalData(newInternalData);
    timeoutRef.current = setTimeout(() => onChange(newInternalData), 250);
  }

  const estimatedTotal =
    internalData.estimatedRedCount +
    internalData.estimatedYellowCount +
    internalData?.estimatedGreenCount +
    internalData.estimatedZebraCount;

  return (
    <div className="display-flex flex-row flex-align-center flex-justify">
      <MciCounter
        className="flex-1"
        isEditable={!internalData.endedAt}
        label="Immediate"
        type="immediate"
        name="estimatedRedCount"
        value={internalData.estimatedRedCount}
        onChange={onChangeInternal}
      />
      <h2 className="margin-x-1">+</h2>
      <MciCounter
        className="flex-1"
        isEditable={!internalData.endedAt}
        label="Delayed"
        type="delayed"
        name="estimatedYellowCount"
        value={internalData.estimatedYellowCount}
        onChange={onChangeInternal}
      />
      <h2 className="margin-x-1">+</h2>
      <MciCounter
        className="flex-1"
        isEditable={!internalData.endedAt}
        label="Minor"
        type="minor"
        name="estimatedGreenCount"
        value={internalData.estimatedGreenCount}
        onChange={onChangeInternal}
      />
      <h2 className="margin-x-1">+</h2>
      <MciCounter
        className="flex-1"
        isEditable={!internalData.endedAt}
        label="Dead"
        type="dead"
        name="estimatedZebraCount"
        value={internalData.estimatedZebraCount}
        onChange={onChangeInternal}
      />
      <h2 className="margin-x-1">=</h2>
      <MciCounter className="flex-1" label="Total" type="total" value={estimatedTotal} />
    </div>
  );
}

export default MciEstimatedPatientCounts;
