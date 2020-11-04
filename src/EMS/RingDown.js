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
    <div>
      <form className="usa-form">
        {/* <fieldset class="usa-fieldset">
    
    <h2 id="legend-header">
      *Hospital Selection
    </h2>
    <legend class="usa-legend usa-legend" id="legend-header">*Hospital Destination</legend> 
    <div class="usa-radio">
      <input class="usa-radio__input" 
        id="hospital-sfGeneral" 
        type="radio" 
        name="hospitalSelections" 
        value="SF_General"/>
      <label class="usa-radio__label" 
        for="hospital-sfGeneral">
          SF General</label>
    </div>
    <div class="usa-radio">
      <input class="usa-radio__input" 
        id="hospital-cpmcMissionBernal" 
          type="radio"  
          name="hospitalSelections" 
          value="CPMC_Mission_Bernal"/>
      <label class="usa-radio__label" 
        for="hospital-cpmcMissionBernal">
          CPMC Mission Bernal</label>
    </div>
    <div class="usa-radio">
      <input class="usa-radio__input" 
        id="hospital-cpmcDavies" 
        type="radio" 
        name="hospitalSelections" 
        value="CPMC_Davies"/>
      <label class="usa-radio__label" 
        for="hospital-cpmcDavies">
          CPMC Davies</label>
    </div>
    <div class="usa-radio">
      <input class="usa-radio__input" 
        id="hospital-cpmcVanNess" 
        type="radio" 
        name="hospitalSelections" 
        value="CPMC_Van_Ness"/>
      <label class="usa-radio__label" 
        for="hospital-cpmcVanNess">CPMC Van Ness</label>
    </div>
    <div class="usa-radio">
      <input class="usa-radio__input" 
      id="hospital-StFrancis" 
      type="radio" 
      name="hospitalSelections" 
      value="St_Francis"/>
      <label class="usa-radio__label" 
      for="hospital-StFrancis">
        St. Francis </label>
    </div>
    <div class="usa-radio">
      <input class="usa-radio__input" 
      id="hospital-chineseHospital" 
      type="radio" 
      name="hospitalSelections" 
      value="Chinese_Hospital"/>
      <label class="usa-radio__label" 
      for="hospital-chineseHospital">Chinese Hospital</label>
    </div>
    <div class="usa-radio">
      <input class="usa-radio__input" 
      id="hospital-kaiserSf" 
      type="radio" 
      name="hospitalSelections" 
      value="Kaiser_SF"/>
      <label class="usa-radio__label" 
      for="hospital-kaiserSf">Kaiser SF</label>
    </div>
    <div class="usa-radio">
      <input class="usa-radio__input" 
      id="hospital-stMarys" 
      type="radio" 
      name="hospitalSelections" 
      value="St_Marys"/>
      <label class="usa-radio__label" 
      for="hospital-stMarys">St. Mary's</label>
    </div>
    <div class="usa-radio">
      <input class="usa-radio__input" 
      id="hospital-ucsfParnassus" 
      type="radio" 
      name="hospitalSelections" 
      value="UCSF_Parnasus"/>
      <label class="usa-radio__label" 
      for="hospital-ucsfParnassus">UCSF Parnassus</label>
    </div>
    <div class="usa-radio">
      <input class="usa-radio__input" 
      id="hospital-vaMedicalCenter" 
      type="radio" 
      name="hospitalSelections" 
      value="VA_Medical_Center"/>
      <label class="usa-radio__label" 
      for="hospital-vaMedicalCenter">VA Medical Center</label>
    </div>
  </fieldset> */}

        <fieldset className="usa-fieldset">
          {!saved ? (
            <label id="unitLabel" htmlFor="unit">
              {' '}
              Unit # <input id="unit" value={unit} onChange={(e) => setUnit(e.target.value)} type="text" />
            </label>
          ) : (
            <div>
              <p> Unit #</p> <p>{unit}</p>
            </div>
          )}
          {!saved ? (
            <label id="incidentLabel" htmlFor="incidentId">
              {' '}
              Incident # <input id="incidentId" value={incidentId} onChange={(e) => setIncidentId(e.target.value)} type="text" />
            </label>
          ) : (
            <div>
              <p> Incident Id</p> <p>{incidentId}</p>
            </div>
          )}

          <header className="usa-header">
            <h2>Patient Info</h2>
          </header>
          <div className="personalInfo">
            {!saved ? (
              <label id="ageLabel" htmlFor="age">
                {' '}
                Age (estim.){' '}
                <input className="usa-input--small" id="age" size="2" value={age} onChange={(e) => setAge(e.target.value)} type="text" />
              </label>
            ) : (
              <div>
                <p> Estimated Age</p> <p>{age}</p>
              </div>
            )}

            {!saved ? (
              <div className="usa-radio">
                <label className="usa-radio__label" htmlFor="male">
                  Male
                  <input className="usa-radio__input" id="male" value="male" onChange={(e) => setGender(e.target.value)} type="radio" />
                </label>
              </div>
            ) : (
              <div>
                <p>{gender}</p>
              </div>
            )}
            {!saved ? (
              <div className="usa-radio">
                <label id="femaleLabel" className="usa-radio__label" htmlFor="female">
                  {' '}
                  Female
                  <input id="female" className="usa-radio__input" value="female" onChange={(e) => setGender(e.target.value)} type="radio" />
                </label>
              </div>
            ) : (
              <div>
                <p>{gender}</p>
              </div>
            )}
            {!saved ? (
              <div className="usa-radio">
                <label id="non-binaryLabel" className="usa-radio__label" htmlFor="non-binary">
                  Non-Binary
                  <input
                    id="non-binary"
                    className="usa-radio__input"
                    value="non-binary"
                    onChange={(e) => setGender(e.target.value)}
                    type="radio"
                  />
                </label>
              </div>
            ) : (
              <div>
                <p>{gender}</p>
              </div>
            )}

            {!saved ? (
              <div className="usa-radio">
                <label id="code2Label" className="usa-radio__label" htmlFor="code2">
                  {' '}
                  Code 2{' '}
                  <input id="code2" className="usa-radio__input" value={code} onChange={(e) => setCode(e.target.value)} type="radio" />
                </label>
              </div>
            ) : (
              <div>
                <p> Code</p> <p>{code}</p>
              </div>
            )}

            {!saved ? (
              <div className="usa-radio">
                <label id="code3Label" className="usa-radio__label" htmlFor="code3">
                  {' '}
                  Code 3{' '}
                  <input id="code3" className="usa-radio__input" value={code} onChange={(e) => setCode(e.target.value)} type="radio" />
                </label>
              </div>
            ) : (
              <div>
                <p> Code</p> <p>{code}</p>
              </div>
            )}
            {!saved ? (
              <label id="complaintLabel" htmlFor="complaint">
                {' '}
                ChiefComplaint{' '}
                <textarea id="complaint" value={complaint} onChange={(e) => setComplaint(e.target.value)} type="text" size="100" />
              </label>
            ) : (
              <div>
                <p> Chief complaint</p> <p>{code}</p>
              </div>
            )}
            {!saved ? (
              <div className="usa-radio">
                <label id="stableLabel" className="usa-radio__label" htmlFor="stable">
                  {' '}
                  Vitals stable{' '}
                  <input id="stable" className="usa-radio__input" value="yes" onChange={(e) => setStable(e.target.value)} type="radio" />
                </label>
              </div>
            ) : (
              <div>
                <p> Vitals stable</p> <p>{stable}</p>
              </div>
            )}
            {!saved ? (
              <div className="usa-radio">
                <label id="unstableLabel" className="usa-radio__label" htmlFor="unstable">
                  {' '}
                  Vitals not stable{' '}
                  <input id="unstable" className="usa-radio__input" value="no" onChange={(e) => setStable(e.target.value)} type="radio" />
                </label>
              </div>
            ) : (
              <div>
                <p> Vitals stable</p> <p>{stable}</p>
              </div>
            )}
          </div>
          <div className="usa-accordion">
            <h2 className="usa-accordion__heading">
              <button type="button" className="usa-accordion__button" aria-expanded="false" aria-controls="a4">
                Vitals
              </button>
            </h2>
            <div id="a4" className="usa-accordion__content usa-prose">
              {!saved ? (
                <div>
                  <label id="bpLabel" className="usa-label" htmlFor="bp">
                    {' '}
                    Blood Pressure
                    <input id="bp" className="usa-input" value={bp} onChange={(e) => setBp(e.target.value)} type="text" />
                  </label>
                </div>
              ) : (
                <div>
                  <p>Blood Pressure</p> <p>{bp}</p>
                </div>
              )}
              {!saved ? (
                <div>
                  <label id="pulseLabel" className="usa-label" htmlFor="pulse">
                    {' '}
                    Pulse Rate
                    <input id="pulse" className="usa-input--small" value={pulse} onChange={(e) => setPulse(e.target.value)} type="text" />
                  </label>
                </div>
              ) : (
                <div>
                  <p>Pulse Rate</p> <p>{pulse}</p>
                </div>
              )}
              {!saved ? (
                <div>
                  <label id="respiratoryLabel" className="usa-label" htmlFor="respiratory">
                    {' '}
                    Respiratory Rate
                    <input
                      id="respiratory"
                      className="usa-input--small"
                      value={respiratory}
                      onChange={(e) => setRespiratory(e.target.value)}
                      type="text"
                    />
                  </label>
                </div>
              ) : (
                <div>
                  <p>Respiratory Rate</p> <p>{respiratory}</p>
                </div>
              )}

              {!saved ? (
                <div>
                  <label id="spo2Label" className="usa-label" htmlFor="spo2">
                    {' '}
                    SpO <input id="spo2" className="usa-input--small" value={spo2} onChange={(e) => setSpo2(e.target.value)} type="text" />
                  </label>
                </div>
              ) : (
                <div>
                  <p> SpO</p> <p>{spo2}</p>
                </div>
              )}
              {!saved ? (
                <div className="usa-radio">
                  <label id="RALabel" className="usa-radio__label" htmlFor="RA">
                    {' '}
                    RA <input className="usa-radio__input" id="RA" value onChange={(e) => setRa(e.target.value)} type="radio" />
                  </label>
                </div>
              ) : (
                <div>
                  <p> RA</p> <p>{ra}</p>
                </div>
              )}
              {!saved ? (
                <div className="usa-radio">
                  <label id="O2Label" className="usa-radio__label" htmlFor="O2">
                    {' '}
                    O2 <input id="O2" className="usa-radio__input" value onChange={(e) => setO2(e.target.value)} type="radio" />
                  </label>
                </div>
              ) : (
                <div>
                  <p> O2</p> <p>{o2}</p>
                </div>
              )}
              {/* {!saved ? (
          <label htmlFor="L">
            {' '}
            L{' '}
            <input
              id="L"
              value={L}
              onChange={(e) => setL(e.target.value)}
              type="text"
            />
          </label>
        ) : (
          <div>
            <p>L</p> <p>{temp}</p>
          </div>
        )} */}
              {!saved ? (
                <div>
                  <label id="tempLabel" className="usa-label" htmlFor="temp">
                    {' '}
                    Temperature
                    <input id="temp" className="usa-input" value={temp} onChange={(e) => setTemp(e.target.value)} type="text" />
                  </label>
                </div>
              ) : (
                <div>
                  <p>Temperature</p> <p>{temp}</p>
                </div>
              )}
            </div>
          </div>

          <div className="additionalNotes">
            <legend className="usa-legend">Addtl. Notes (optional)</legend>
            <div className="usa-checkbox">
              <label className="usa-checkbox__label" htmlFor="ETOH">
                <input className="usa-checkbox__input" id="ETOH" type="checkbox" name="additionalNotes" value="ETOH_suspected" checked />
                ETOH suspected
              </label>
            </div>
            <div className="usa-checkbox">
              <label className="usa-checkbox__label" htmlFor="drugs">
                <input className="usa-checkbox__input" id="drugs" type="checkbox" name="additionalNotes" value="drugs_suspected" />
                Drugs suspected
              </label>
            </div>
            <div className="usa-checkbox">
              <label className="usa-checkbox__label" htmlFor="psych">
                <input className="usa-checkbox__input" id="psych" type="checkbox" name="additionalNotes" value="psych_patient" />
                Psych patient
              </label>
            </div>
            <div className="usa-checkbox">
              <label className="usa-checkbox__label" htmlFor="combative">
                <input className="usa-checkbox__input" id="combative" type="checkbox" name="additionalNotes" value="combative_patient" />
                Combative
              </label>
            </div>
            <div className="usa-checkbox">
              <label className="usa-checkbox__label" htmlFor="4-point">
                <input className="usa-checkbox__input" id="4-point" type="checkbox" name="additionalNotes" value="combative_patient" />
                4-point restraint
              </label>
            </div>
            <div className="usa-checkbox">
              <label className="usa-checkbox__label" htmlFor="COVID">
                <input className="usa-checkbox__input" id="COVID" type="checkbox" name="additionalNotes" value="COVID-19_suspected" />
                COVID-19 suspected
              </label>
            </div>
            <div className="usa-checkbox">
              <label className="usa-checkbox__label" htmlFor="IV">
                <input className="usa-checkbox__input" id="IV" type="checkbox" name="additionalNotes" value="IV_started" />
                IV started
              </label>
            </div>
          </div>

          <div className="usa-character-count">
            <div className="usa-form-group">
              <label className="usa-label" htmlFor="with-hint-textarea">
                Other
                <span id="with-hint-textarea-hint" className="usa-hint" />
                <textarea
                  className="usa-textarea usa-character-count__field"
                  id="with-hint-textarea"
                  maxLength="50"
                  name="with-hint-textarea"
                  rows="5"
                  aria-describedby="with-hint-textarea-info with-hint-textarea-hint"
                />
              </label>
            </div>
            <span id="with-hint-textarea-info" className="usa-hint usa-character-count__message" aria-live="polite" />
          </div>
        </fieldset>
      </form>
      <div className="select">
        <button className="usa-button usa-button--big" type="button" onClick={save}>
          Select Hospital
        </button>
      </div>
      <div className="clear">
        <button className="usa-button usa-button--outline usa-button--big" type="button" onClick={save}>
          Clear Form
        </button>
      </div>
    </div>
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
