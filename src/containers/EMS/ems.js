import React, { useState } from 'react';
import '../../css/App.css';
import '../../css/nav.css';
import Beds from './beds';
import RingDown from './ringDown';

const EMS = (/* props */) => {
  const dateObj = new Date();
  const [beds, setBeds] = useState(false);
  const [ringDown, setRingDown] = useState(true);
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
      <div className="header">
       <h2 id="appName">Hospital Destination Tool</h2>
       <h2 id="appTimeDisplay">{dateObj.toLocaleTimeString()}</h2>
      </div>
      <div className="nav">

        <div className={ringDown ? 'ringDownTabselected' : 'ringDownTab'}>
          <button type="button" className="ringDown" onClick={handleClick}>
            Ringdown
          </button>
        </div>
        <div className={beds ? 'bedTabSelected' : 'bedTab'}>
          <button type="button" className="beds" onClick={handleClick}>
            Hospital Info
          </button>
        </div>
       
      </div>
      {beds && <Beds />}
      {ringDown && <RingDown history={history} saveHistory={saveHistory} />}
    </div>
  );
};

export default EMS;
