import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import MciCounter from '../../../Components/MciCounter';

function MciPatientCounts({ className, data, includeDead, isEditable, onChange }) {
  const timeoutRef = useRef();
  const [internalData, setInternalData] = useState(data);

  useEffect(() => {
    setInternalData(data);
  }, [data]);

  function onChangeInternal(event) {
    clearTimeout(timeoutRef.current);
    const newInternalData = { ...internalData };
    newInternalData[event.target.name] = event.target.value;
    setInternalData(newInternalData);
    timeoutRef.current = setTimeout(() => onChange(newInternalData), 250);
  }

  const estimatedTotal = internalData.estimatedRedCount + internalData.estimatedYellowCount + internalData.estimatedGreenCount;

  return (
    <div className={classNames('display-flex flex-row flex-align-center flex-justify', className)}>
      <MciCounter
        className="flex-1"
        isEditable={isEditable}
        label="Immediate"
        type="immediate"
        name="estimatedRedCount"
        value={internalData.estimatedRedCount}
        onChange={onChangeInternal}
      />
      <h2 className="margin-x-1">+</h2>
      <MciCounter
        className="flex-1"
        isEditable={isEditable}
        label="Delayed"
        type="delayed"
        name="estimatedYellowCount"
        value={internalData.estimatedYellowCount}
        onChange={onChangeInternal}
      />
      <h2 className="margin-x-1">+</h2>
      <MciCounter
        className="flex-1"
        isEditable={isEditable}
        label="Minor"
        type="minor"
        name="estimatedGreenCount"
        value={internalData.estimatedGreenCount}
        onChange={onChangeInternal}
      />
      <h2 className="margin-x-1">=</h2>
      <MciCounter className="flex-1" label="Total" type="total" value={estimatedTotal} />
      <h2 className="margin-x-1 opacity-0">+</h2>
      <MciCounter
        className={classNames('flex-1', { 'opacity-0': !includeDead })}
        isEditable={isEditable}
        label="Dead"
        type="dead"
        name="estimatedZebraCount"
        value={internalData.estimatedZebraCount ?? 0}
        onChange={onChangeInternal}
      />
    </div>
  );
}

export default MciPatientCounts;
