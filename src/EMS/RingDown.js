import React, { useState } from 'react';
import PropTypes from 'prop-types';

const RingDown = ({ history, saveHistory }) => {
  const [saved, setSaved] = useState(history?.saved ?? false);
  const [saveTime, setSaveTime] = useState(history?.saveTime ?? '');
  const [incidentId, setIncidentId] = useState(history?.incidentId ?? '');
  const [unit, setUnit] = useState(history?.unit ?? '');
  const [patientDisplay /* setPatientDisplay */] = useState(history?.patientDisplay ?? false);
  const [age, setAge] = useState(history?.age ?? '');
  const [gender, setGender] = useState(history?.gender ?? '');
  const [code, setCode] = useState(history?.code ?? '');
  const [complaint, setComplaint] = useState(history?.complaint ?? '');
  const [stable, setStable] = useState(history?.stable ?? '');
  const [vitalsDisplay /* setVitalsDisplay */] = useState(history?.vitalsDisplay ?? false);
  const [bp, setBp] = useState(history?.bp ?? '');
  const [pulse, setPulse] = useState(history?.pulse ?? '');
  const [respiratory, setRespiratory] = useState(history?.respiratory ?? '');
  const [spo2, setSpo2] = useState(history?.spo2 ?? '');
  const [ra, setRa] = useState(history?.ra ?? false);
  const [o2, setO2] = useState(history?.o2 ?? false);
  const [temp, setTemp] = useState(history?.temp ?? '');
  const [notesDisplay /* setNotesDisplay */] = useState(history?.notesDisplay ?? false);

  const save = () => {
    const dateObj = new Date();
    setSaved(true);
    setSaveTime(dateObj.getTime());
    saveHistory({
      saved,
      saveTime,
      incidentId,
      unit,
      patientDisplay,
      age,
      gender,
      code,
      complaint,
      stable,
      vitalsDisplay,
      bp,
      pulse,
      respiratory,
      spo2,
      ra,
      o2,
      temp,
      notesDisplay,
    });
  };

  return (
    <>
      <form className="usa-form">
        <div className="usa-alert usa-alert--info usa-alert--slim usa-alert--no-icon">
          <div className="usa-alert__body">
            <p className="usa-alert__text">
              <span className="text-secondary-dark">*</span> Indicates a required field.
            </p>
          </div>
        </div>
        <div className="usa-accordion">
          <div className="usa-accordion__content">
            <fieldset className="usa-fieldset">
              <label htmlFor="unit" className="usa-label usa-label--required">
                Unit #
              </label>
              <input
                id="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                required
                type="text"
                className="usa-input usa-input--medium"
              />
              <label htmlFor="incidentId" className="usa-label usa-label--required">
                Incident #
              </label>
              <input
                id="incidentId"
                value={incidentId}
                onChange={(e) => setIncidentId(e.target.value)}
                required
                type="text"
                className="usa-input usa-input--medium"
              />
            </fieldset>
          </div>
          <h3 className="usa-accordion__heading">
            <button disabled type="button" className="usa-accordion__button">
              <span className="text-secondary-dark">*</span> Patient Info
            </button>
          </h3>
          <div className="usa-accordion__content">
            <fieldset className="usa-fieldset">
              <label htmlFor="age" className="usa-label">
                Age (estim.)
              </label>
              <input
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                type="number"
                className="usa-input usa-input--small"
              />
            </fieldset>
            <fieldset className="usa-fieldset">
              <div className="usa-radio">
                <input
                  onChange={(e) => setGender(e.target.value)}
                  className="usa-radio__input"
                  id="gender-male"
                  type="radio"
                  name="gender"
                  value="MALE"
                />
                <label className="usa-radio__label" htmlFor="gender-male">
                  Male
                </label>
              </div>
              <div className="usa-radio">
                <input
                  onChange={(e) => setGender(e.target.value)}
                  className="usa-radio__input"
                  id="gender-female"
                  type="radio"
                  name="gender"
                  value="FEMALE"
                />
                <label className="usa-radio__label" htmlFor="gender-female">
                  Female
                </label>
              </div>
              <div className="usa-radio">
                <input
                  onChange={(e) => setGender(e.target.value)}
                  className="usa-radio__input"
                  id="gender-non-binary"
                  type="radio"
                  name="gender"
                  value="NON-BINARY"
                />
                <label className="usa-radio__label" htmlFor="gender-non-binary">
                  Non-binary
                </label>
              </div>
            </fieldset>
            <fieldset className="usa-fieldset">
              <div className="usa-radio">
                <input
                  onChange={(e) => setCode(e.target.value)}
                  className="usa-radio__input"
                  id="code-2"
                  type="radio"
                  name="code"
                  value="CODE 2"
                />
                <label className="usa-radio__label" htmlFor="code-2">
                  Code 2
                </label>
              </div>
              <div className="usa-radio">
                <input
                  onChange={(e) => setCode(e.target.value)}
                  className="usa-radio__input"
                  id="code-3"
                  type="radio"
                  name="code"
                  value="CODE 3"
                />
                <label className="usa-radio__label" htmlFor="code-3">
                  Code 3
                </label>
              </div>
            </fieldset>
            <fieldset className="usa-fieldset">
              <label htmlFor="complaint" className="usa-label">
                Chief Complaint
              </label>
              <textarea id="complaint" value={complaint} onChange={(e) => setComplaint(e.target.value)} required className="usa-textarea" />
              <div className="usa-hint usa-hint--important">
                <i className="fas fa-info-circle" /> Exclude identifying information.
              </div>
            </fieldset>
            <fieldset className="usa-fieldset">
              <div className="usa-radio">
                <input
                  onChange={(e) => setStable(e.target.value)}
                  className="usa-radio__input"
                  id="vitals-stable"
                  type="radio"
                  name="vitals"
                  value
                />
                <label className="usa-radio__label" htmlFor="vitals-stable">
                  Vitals stable
                </label>
              </div>
              <div className="usa-radio">
                <input
                  onChange={(e) => setStable(e.target.value)}
                  className="usa-radio__input"
                  id="vitals-not-stable"
                  type="radio"
                  name="vitals"
                  value={false}
                />
                <label className="usa-radio__label" htmlFor="vitals-not-stable">
                  Vitals not stable
                </label>
              </div>
            </fieldset>
          </div>
          <h3 className="usa-accordion__heading">
            <button type="button" className="usa-accordion__button">
              Vitals <span>(optional)</span>
            </button>
          </h3>
          <div className="usa-accordion__content">
            <fieldset className="usa-fieldset">
              <label htmlFor="bp" className="usa-label">
                Blood pressure
              </label>
              <div className="grid-row flex-align-center">
                <input id="bp" value={bp} onChange={(e) => setBp(e.target.value)} type="number" className="usa-input usa-input--small" />
                <span className="usa-hint usa-hint--unit">&nbsp;&nbsp;/&nbsp;&nbsp;</span>
                <input onChange={(e) => setBp(e.target.value)} type="number" className="usa-input usa-input--small" />
                <span className="usa-hint usa-hint--unit">&nbsp;&nbsp;mmHg</span>
              </div>
              <label htmlFor="pulse" className="usa-label">
                Pulse
              </label>
              <div className="grid-row flex-align-center">
                <input
                  id="pulse"
                  value={pulse}
                  onChange={(e) => setPulse(e.target.value)}
                  type="number"
                  className="usa-input usa-input--small"
                />
                <span className="usa-hint usa-hint--unit">&nbsp;&nbsp;bpm</span>
              </div>
              <label htmlFor="respiratory" className="usa-label">
                Respiratory Rate
              </label>
              <div className="grid-row flex-align-center">
                <input
                  id="respiratory"
                  value={respiratory}
                  onChange={(e) => setRespiratory(e.target.value)}
                  type="number"
                  className="usa-input usa-input--small"
                />
                <span className="usa-hint usa-hint--unit">&nbsp;&nbsp;breath/m</span>
              </div>
              <label htmlFor="spo2" className="usa-label">
                SpO2
              </label>
              <div className="grid-row flex-align-center">
                <input
                  id="spo2"
                  value={spo2}
                  onChange={(e) => setSpo2(e.target.value)}
                  type="number"
                  className="usa-input usa-input--small"
                />
                <span className="usa-hint usa-hint--unit">&nbsp;&nbsp;%</span>
              </div>
              <div className="padding-left-4">
                <div className="usa-radio">
                  <input onChange={(e) => setRa(e.target.value)} className="usa-radio__input" id="ra" type="radio" name="ra" value />
                  <label className="usa-radio__label" htmlFor="ra">
                    RA
                  </label>
                </div>
                <div className="grid-row flex-align-center">
                  <div className="usa-radio">
                    <input
                      onChange={(e) => setO2(e.target.value)}
                      className="usa-radio__input"
                      id="o2"
                      type="radio"
                      name="o2"
                      value={false}
                    />
                    <label className="usa-radio__label" htmlFor="o2">
                      O2
                    </label>
                  </div>
                  <input
                    id="o2level"
                    value={o2}
                    onChange={(e) => setO2(e.target.value)}
                    type="number"
                    className="usa-input usa-input--inline usa-input--small margin-left-4"
                  />
                  <span className="usa-hint usa-hint--inline usa-hint--unit">&nbsp;&nbsp;L</span>
                </div>
              </div>
              <label htmlFor="temp" className="usa-label">
                Temp.
              </label>
              <div className="grid-row flex-align-center">
                <input
                  id="temp"
                  value={temp}
                  onChange={(e) => setTemp(e.target.value)}
                  type="number"
                  className="usa-input usa-input--small"
                />
                <span className="usa-hint usa-hint--unit">&nbsp;&nbsp;&deg;F</span>
              </div>
            </fieldset>
          </div>
          <h3 className="usa-accordion__heading">
            <button disabled type="button" className="usa-accordion__button">
              Addtl. Notes <span>(optional)</span>
            </button>
          </h3>
          <div className="usa-accordion__content">
            <fieldset className="usa-fieldset">
              <div className="usa-checkbox">
                <input className="usa-checkbox__input" id="ETOH" type="checkbox" name="additionalNotes" value="ETOH_suspected" />
                <label className="usa-checkbox__label" htmlFor="ETOH">
                  ETOH suspected
                </label>
              </div>
              <div className="usa-checkbox">
                <label className="usa-checkbox__label" htmlFor="drugs">
                  Drugs suspected
                </label>
                <input className="usa-checkbox__input" id="drugs" type="checkbox" name="additionalNotes" value="drugs_suspected" />
              </div>
              <div className="usa-checkbox">
                <label className="usa-checkbox__label" htmlFor="psych">
                  Psych patient
                </label>
                <input className="usa-checkbox__input" id="psych" type="checkbox" name="additionalNotes" value="psych_patient" />
              </div>
              <div className="usa-checkbox">
                <label className="usa-checkbox__label" htmlFor="combative">
                  Combative
                </label>
                <input className="usa-checkbox__input" id="combative" type="checkbox" name="additionalNotes" value="combative_patient" />
              </div>
              <div className="usa-checkbox padding-left-4">
                <label className="usa-checkbox__label" htmlFor="4-point">
                  4-point restraint
                </label>
                <input className="usa-checkbox__input" id="4-point" type="checkbox" name="additionalNotes" value="combative_patient" />
              </div>
              <div className="usa-checkbox">
                <label className="usa-checkbox__label" htmlFor="COVID">
                  COVID-19 suspected
                </label>
                <input className="usa-checkbox__input" id="COVID" type="checkbox" name="additionalNotes" value="COVID-19_suspected" />
              </div>
              <div className="usa-checkbox">
                <label className="usa-checkbox__label" htmlFor="IV">
                  IV started
                </label>
                <input className="usa-checkbox__input" id="IV" type="checkbox" name="additionalNotes" value="IV_started" />
              </div>
              <label className="usa-label" htmlFor="other">
                Other
              </label>
              <textarea className="usa-textarea" id="other" name="other" rows="5" />
            </fieldset>
            <fieldset className="usa-fieldset">
              <button className="usa-button width-full" type="button" onClick={save}>
                Select Hospital
              </button>
              <button className="usa-button usa-button--outline width-full margin-top-4" type="button" onClick={save}>
                Clear Form
              </button>
            </fieldset>
          </div>
        </div>
      </form>
    </>
  );
};

RingDown.propTypes = {
  history: PropTypes.shape({
    patientDisplay: PropTypes.bool,
    vitalsDisplay: PropTypes.bool,
    code: PropTypes.string,
    saved: PropTypes.bool,
    saveTime: PropTypes.string,
    incidentId: PropTypes.string,
    unit: PropTypes.string,
    age: PropTypes.string,
    gender: PropTypes.string,
    complaint: PropTypes.string,
    bp: PropTypes.string,
    pulse: PropTypes.string,
    respiratory: PropTypes.string,
    spo2: PropTypes.string,
    temp: PropTypes.string,
    notesDisplay: PropTypes.string,
    ra: PropTypes.string,
    o2: PropTypes.string,
    stable: PropTypes.string,
  }).isRequired,
  saveHistory: PropTypes.func.isRequired,
};

export default RingDown;
