import React, { useState } from 'react';
import '../../App.css';
import '../../nav.css';
import Beds from './beds';
import RingDown from './ringDown';

const EMS = (/* props */) => {
  const [beds, setBeds] = useState(true);
  const [ringDown, setRingDown] = useState(false);
  // const [unitId, setUnitId] = useState('');
  // const [patientId, setPatientId] = useState('');
  const [history, setHistory] = useState({});

  const handleClick = () => {
    setBeds(!beds);
    setRingDown(!ringDown);
  };

  const saveHistory = (newHistory) => {
    setHistory(newHistory);
    return history;
  };

  return (
    <div className="emsContainer">
      <div className="nav">
        <h2>EMS-SFFD</h2>
        <div className={beds ? 'bedTabSelected' : 'bedTab'}>
          <button type="button" className="beds" onClick={handleClick}>
            Beds
          </button>
        </div>
        <div className={ringDown ? 'ringDownTabselected' : 'ringDownTab'}>
          <button type="button" className="ringDown" onClick={handleClick}>
            Ring Down
          </button>
        </div>
      </div>
      {beds && <Beds />}
      {ringDown && <RingDown history={history} saveHistory={saveHistory} />}
    </div>
  );
};

export default EMS;
