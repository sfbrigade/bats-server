import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './RingdownDetails.scss';

function RingdownDetails({ className, ringdown }) {
  return (
    <table className={classNames('usa-table usa-table--borderless width-full ringdown-details', className)}>
      <tbody>
        <tr>
          <th colSpan="2">Incident #{ringdown.emsCall.dispatchCallNumber}</th>
        </tr>
        <tr>
          <th>Unit #</th>
          <td>{ringdown.ambulance.ambulanceIdentifier}</td>
        </tr>
        <tr>
          <th colSpan="2">Patient info</th>
        </tr>
        <tr>
          <th>Estim. Age</th>
          <td>{ringdown.patient.age}</td>
        </tr>
        <tr>
          <th>Gender I.D.</th>
          <td>{ringdown.patient.sex}</td>
        </tr>
        <tr>
          <th>Code</th>
          <td>{ringdown.patient.emergencyServiceResponseType}</td>
        </tr>
        <tr>
          <th>Complaint</th>
          <td>{ringdown.patient.chiefComplaintDescription}</td>
        </tr>
        <tr>
          <th>Vitals</th>
          <td>{ringdown.patient.stableIndicator ? 'Stable' : 'Unstable'}</td>
        </tr>
        <tr>
          <th colSpan="2">Vitals</th>
        </tr>
        <tr>
          <th>BP</th>
          <td>
            {ringdown.patient.systolicBloodPressure}/{ringdown.patient.diastolicBloodPressure}
          </td>
        </tr>
        <tr>
          <th>Pulse</th>
          <td>{ringdown.patient.heartRateBpm}&nbsp;bpm</td>
        </tr>
        <tr>
          <th>RR</th>
          <td>{ringdown.patient.respiratoryRate}&nbsp;breath/m</td>
        </tr>
        <tr>
          <th>Sp02</th>
          <td>
            {ringdown.patient.oxygenSaturation}%<br />
            {ringdown.patient.lowOxygenResponseType}
            {ringdown.patient.lowOxygenResponseType === 'SUPPLEMENTAL OXYGEN' && (
              <>&nbsp;{ringdown.patient.supplementalOxygenAmount}&nbsp;L</>
            )}
          </td>
        </tr>
        <tr>
          <th>Temp</th>
          <td>{ringdown.patient.temperature}&nbsp;&deg;F</td>
        </tr>
        <tr>
          <th colSpan="2">Additional notes</th>
        </tr>
        <tr>
          <th>ETOH</th>
          <td>{ringdown.patient.etohSuspectedIndicator && 'Suspected'}</td>
        </tr>
        <tr>
          <th>Drugs</th>
          <td>{ringdown.patient.drugsSuspectedIndicator && 'Suspected'}</td>
        </tr>
        <tr>
          <th>Psych</th>
          <td>{ringdown.patient.psychIndicator && 'Yes'}</td>
        </tr>
        <tr>
          <th>Combative</th>
          <td>
            {ringdown.patient.combativeBehaviorIndicator && 'Yes'}
            {ringdown.patient.restraintIndicator && <>&nbsp;Restrained</>}
          </td>
        </tr>
        <tr>
          <th>COVID-19</th>
          <td>{ringdown.patient.covid19SuspectedIndicator && 'Yes'}</td>
        </tr>
        <tr>
          <th>IV</th>
          <td>{ringdown.patient.ivIndicator && 'Started'}</td>
        </tr>
        <tr>
          <th>Other</th>
          <td>{ringdown.patient.otherObservationNotes}</td>
        </tr>
      </tbody>
    </table>
  );
}

RingdownDetails.propTypes = {
  className: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  ringdown: PropTypes.object.isRequired,
};

RingdownDetails.defaultProps = {
  className: null,
};

export default RingdownDetails;
