import React from 'react';
import PropTypes from 'prop-types';

import './RingdownModal.scss';

export default function RingdownModal({ showModal, handleClose, ringdown }) {
  const showHideClassName = showModal ? 'ringdown__modal display__block' : 'ringdown__modal display__none';
  console.log(ringdown);

  return (
    <div className={showHideClassName}>
      <section className="ringdown__modal__main">
        <table>
          <thead>
            <td>  
        <h2>Kaiser</h2>
        </td>
        <td>
        <button type="button" onClick={handleClose}>
          X
        </button>
        </td>
        <hr/>
        </thead>
        <tbody>
          <tr>
        <td>
        <strong>Patient info</strong>
          <table>
            <tr>
              <td>Age:</td>
              <td>{ringdown?.patient.age}</td>
            </tr>
            <tr>
              <td>Sex: </td>
              <td>{ringdown?.patient.sex}</td>
            </tr>
            <tr>
              <td>Code: </td>
              <td>{ringdown?.patient.emergencyServiceResponseType}</td>
            </tr>
            <tr>
              <td>Vitals Stable: </td>
              <td>{ringdown?.patient.stableIndicator ? "Stable" : "Not Stable"}</td>
            </tr>
          </table>
        </td>
        <td>
        <strong>Vitals</strong>
          <table>
            <tr>
              <td>BP:</td>
              <td>{ringdown?.patient.diastolicBloodPressure}/{ringdown?.patient.systolicBloodPressure}</td>
            </tr>
            <tr>
              <td>Pulse:</td>
              <td>{ringdown?.patient.heartRateBpm}</td>
            </tr>
            <tr>
              <td>Resp. Rate:</td>
              <td>{ringdown?.patient.respiratoryRate}</td>
            </tr>
            <tr>
              <td>SpO2:</td>
              <td>{ringdown?.patient.supplementalOxygenAmount}</td>
            </tr>
            <tr>
              <td>Temp:</td>
              <td>{ringdown?.patient.temperature}</td>
            </tr>
          </table>
        </td>
        </tr>
        <tr>
        <td />
        <td>
          <strong>Additional notes</strong>
          <table>
            <tr>
              <td>ETOH:</td>
              <td>{ringdown?.patient.etohSuspectedIndicator ? "Suspected": "Not Suspected"}</td>
            </tr>
            <tr>
              <td>Ad'tl Notes:</td>
              <td>{ringdown?.patient.otherObservationNotes}</td>
            </tr>
          </table>
        </td>
        </tr>
        </tbody>
        </table>
      </section>
    </div>
  );
}
RingdownModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  showModal: PropTypes.bool.isRequired,
};
