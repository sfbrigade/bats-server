import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../../ringDown.css';

const RingDown = ({ history, saveHistory }) => {
  const [saved, setSaved] = useState(history?.saved ?? false);
  const [saveTime, setSaveTime] = useState(history?.saveTime ?? '');
  const [patientId, setPatientId] = useState(history?.patientId ?? '');
  const [unit, setUnit] = useState(history?.unit ?? '');
  const [age, setAge] = useState(history?.age ?? '');
  const [gender, setGender] = useState(history?.gender ?? '');
  const [complaint, setComplaint] = useState(history?.complaint ?? '');
  const [bp, setBp] = useState(history?.bp ?? '');
  const [pulse, setPulse] = useState(history?.pulse ?? '');
  const [respiratory, setRespiratory] = useState(history?.respiratory ?? '');
  const [spo2, setSpo2] = useState(history?.spo2 ?? '');
  const [temp, setTemp] = useState(history?.temp ?? '');

  const save = () => {
    const dateObj = new Date();
    setSaved(true);
    setSaveTime(dateObj.getTime());
    saveHistory({
      saved,
      saveTime,
      patientId,
      unit,
      age,
      gender,
      complaint,
      bp,
      pulse,
      respiratory,
      spo2,
      temp,
    });
  };

  // const createHistory = () => {
  // }

  const edit = () => {
    setSaved(false);
  };

  return (
    <div className="ringDownContainer">
      <h1 className="title">RINGDOWN FORM</h1>
      <div className="RingDownInfo">
        <h3 className="title">Identification</h3>
        {!saved ? (
          <label htmlFor="unit">
            {' '}
            Unit #{' '}
            <input
              id="unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              type="text"
            />
          </label>
        ) : (
          <div>
            <p> Unit #</p> <p>{unit}</p>
          </div>
        )}
        {!saved ? (
          <label id="patientLabel" htmlFor="patientId">
            {' '}
            Patient Id{' '}
            <input
              id="patientId"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              type="text"
            />
          </label>
        ) : (
          <div>
            <p> Patient Id</p> <p>{patientId}</p>
          </div>
        )}
      </div>
      <div className="RingDownInfo infoAge">
        <h3 className="title">Age</h3>
        {!saved ? (
          <label id="ageLabel" htmlFor="age">
            {' '}
            Estimated Age{' '}
            <input
              id="age"
              size="2"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              type="text"
            />
          </label>
        ) : (
          <div>
            <p> Estimated Age</p> <p>{age}</p>
          </div>
        )}
      </div>
      <div className="RingDownInfo">
        <h3 className="title">Sex</h3>
        {!saved ? (
          <label id="maleLabel" htmlFor="male">
            Male
            <input
              id="male"
              value="male"
              onChange={(e) => setGender(e.target.value)}
              type="radio"
            />
          </label>
        ) : (
          <div>
            <p>{gender}</p>
          </div>
        )}
        {!saved ? (
          <label id="femaleLabel" htmlFor="female">
            {' '}
            Female
            <input
              id="female"
              value="female"
              onChange={(e) => setGender(e.target.value)}
              type="radio"
            />
          </label>
        ) : (
          <div>
            <p>{gender}</p>
          </div>
        )}
        {!saved ? (
          <label htmlFor="non-binary">
            Non-Binary
            <input
              id="non-binanry"
              value="non-binary"
              onChange={(e) => setGender(e.target.value)}
              type="radio"
            />
          </label>
        ) : (
          <div>
            <p>{gender}</p>
          </div>
        )}
      </div>
      <div className="RingDownInfo">
        <h3 className="title">Stability &amp; Chief Complaint</h3>
        {!saved ? (
          <label htmlFor="complaint">
            {' '}
            Chief Complaint{' '}
            <input
              id="complaint"
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
              type="text"
            />
          </label>
        ) : (
          <div>
            <p> Chief Complaint</p> <p>{complaint}</p>
          </div>
        )}
      </div>
      <div className="RingDownInfo">
        <h3 className="title">Vitals</h3>
        {!saved ? (
          <label htmlFor="bp">
            {' '}
            Blood Pressure
            <input
              id="bp"
              value={bp}
              onChange={(e) => setBp(e.target.value)}
              type="text"
            />
          </label>
        ) : (
          <div>
            <p>Blood Pressure</p> <p>{bp}</p>
          </div>
        )}
        {!saved ? (
          <label htmlFor="pulse">
            {' '}
            Pulse Rate
            <input
              id="pulse"
              value={pulse}
              onChange={(e) => setPulse(e.target.value)}
              type="text"
            />
          </label>
        ) : (
          <div>
            <p>Pulse Rate</p> <p>{pulse}</p>
          </div>
        )}
        {!saved ? (
          <label htmlFor="respiratory">
            {' '}
            Respiratory Rate{' '}
            <input
              id="respiratory"
              value={respiratory}
              onChange={(e) => setRespiratory(e.target.value)}
              type="text"
            />
          </label>
        ) : (
          <div>
            <p>Respiratory Rate</p> <p>{respiratory}</p>
          </div>
        )}
        {!saved ? (
          <label htmlFor="spo2">
            {' '}
            SpO{' '}
            <input
              id="spo2"
              value={spo2}
              onChange={(e) => setSpo2(e.target.value)}
              type="text"
            />
          </label>
        ) : (
          <div>
            <p> SpO</p> <p>{spo2}</p>
          </div>
        )}
        {!saved ? (
          <label htmlFor="temp">
            {' '}
            Temperature{' '}
            <input
              id="temp"
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
              type="text"
            />
          </label>
        ) : (
          <div>
            <p>Temperature</p> <p>{temp}</p>
          </div>
        )}
      </div>
      <div className="RingDownInfo">
        <h3 className="title">Special Circumstances</h3>
      </div>
      <div className="RingDownInfo">
        <h3 className="title">Send to:</h3>
      </div>
      {!saved && (
        <button type="button" onClick={save}>
          SAVE
        </button>
      )}
      {saved && (
        <div>
          {' '}
          <p>{saveTime}</p>{' '}
          <button type="button" onClick={edit}>
            EDIT
          </button>
        </div>
      )}
    </div>
  );
};

RingDown.propTypes = {
  history: PropTypes.shape({
    saved: PropTypes.bool,
    saveTime: PropTypes.string,
    patientId: PropTypes.string,
    unit: PropTypes.string,
    age: PropTypes.string,
    gender: PropTypes.string,
    complaint: PropTypes.string,
    bp: PropTypes.string,
    pulse: PropTypes.string,
    respiratory: PropTypes.string,
    spo2: PropTypes.string,
    temp: PropTypes.string,
  }).isRequired,
  saveHistory: PropTypes.func.isRequired,
};

export default RingDown;
