import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { DateTime } from 'luxon';

import './RingdownDetails.scss';
import Ringdown from '../Models/Ringdown';

function RingdownDetails({ className, ringdown, isIncoming }) {
  return (
    <table className={classNames('usa-table usa-table--borderless width-full ringdown-details', className)}>
      <tbody>
        <tr>
          <th colSpan="2">
            {isIncoming && <>Incoming Ambulance</>}
            {!isIncoming && <>Incident #{ringdown.dispatchCallNumber}</>}
          </th>
        </tr>
        <tr>
          <th>Unit #</th>
          <td>{ringdown.ambulanceIdentifier}</td>
        </tr>
        {isIncoming && (
          <>
            <tr>
              <th>Incident #</th>
              <td>{ringdown.dispatchCallNumber}</td>
            </tr>
            <tr>
              <th>ETA</th>
              <td>{ringdown.etaDateTimeLocalObj.toLocaleString(DateTime.TIME_24_WITH_SECONDS)}</td>
            </tr>
          </>
        )}
        <tr>
          <th colSpan="2">Patient info</th>
        </tr>
        <tr>
          <th>Estim. Age</th>
          <td>{ringdown.age}</td>
        </tr>
        <tr>
          <th>Gender I.D.</th>
          <td>{ringdown.sex}</td>
        </tr>
        <tr>
          <th>Code</th>
          <td>{ringdown.emergencyServiceResponseType}</td>
        </tr>
        <tr>
          <th>Complaint</th>
          <td>{ringdown.chiefComplaintDescription}</td>
        </tr>
        <tr>
          <th>Vitals</th>
          <td>{ringdown.stableIndicator ? 'Stable' : 'Unstable'}</td>
        </tr>
        {ringdown.hasVitals && (
          <>
            <tr>
              <th colSpan="2">Vitals</th>
            </tr>
            {(ringdown.systolicBloodPressure || ringdown.diastolicBloodPressure) && (
              <tr>
                <th>BP</th>
                <td>
                  {ringdown.systolicBloodPressure}/{ringdown.diastolicBloodPressure}
                </td>
              </tr>
            )}
            {ringdown.heartRateBpm && (
              <tr>
                <th>Pulse</th>
                <td>{ringdown.heartRateBpm}&nbsp;bpm</td>
              </tr>
            )}
            {ringdown.respiratoryRate && (
              <tr>
                <th>RR</th>
                <td>{ringdown.respiratoryRate}&nbsp;breath/m</td>
              </tr>
            )}
            {(ringdown.oxygenSaturation || ringdown.lowOxygenResponseType || ringdown.supplementalOxygenAmount) && (
              <tr>
                <th>Sp02</th>
                <td>
                  {ringdown.oxygenSaturation}%<br />
                  {ringdown.lowOxygenResponseType}
                  {ringdown.lowOxygenResponseType === 'SUPPLEMENTAL OXYGEN' && <>&nbsp;{ringdown.supplementalOxygenAmount}&nbsp;L</>}
                </td>
              </tr>
            )}
            {ringdown.temperature && (
              <tr>
                <th>Temp</th>
                <td>{ringdown.temperature}&nbsp;&deg;F</td>
              </tr>
            )}
          </>
        )}
        {ringdown.hasAdditionalNotes && (
          <>
            <tr>
              <th colSpan="2">Additional notes</th>
            </tr>
            {ringdown.etohSuspectedIndicator && (
              <tr>
                <th>ETOH</th>
                <td>{ringdown.etohSuspectedIndicator && 'Suspected'}</td>
              </tr>
            )}
            {ringdown.drugsSuspectedIndicator && (
              <tr>
                <th>Drugs</th>
                <td>{ringdown.drugsSuspectedIndicator && 'Suspected'}</td>
              </tr>
            )}
            {ringdown.psychIndicator && (
              <tr>
                <th>Psych</th>
                <td>{ringdown.psychIndicator && 'Yes'}</td>
              </tr>
            )}
            {ringdown.combativeBehaviorIndicator && (
              <tr>
                <th>Combative</th>
                <td>
                  {ringdown.combativeBehaviorIndicator && 'Yes'}
                  {ringdown.restraintIndicator && <>&nbsp;Restrained</>}
                </td>
              </tr>
            )}
            {ringdown.covid19SuspectedIndicator && (
              <tr>
                <th>COVID-19</th>
                <td>{ringdown.covid19SuspectedIndicator && 'Suspected'}</td>
              </tr>
            )}
            {ringdown.ivIndicator && (
              <tr>
                <th>IV</th>
                <td>{ringdown.ivIndicator && 'Started'}</td>
              </tr>
            )}
            {ringdown.otherObservationNotes && (
              <tr>
                <th>Other</th>
                <td>{ringdown.otherObservationNotes}</td>
              </tr>
            )}
          </>
        )}
      </tbody>
    </table>
  );
}

RingdownDetails.propTypes = {
  className: PropTypes.string,
  ringdown: PropTypes.instanceOf(Ringdown).isRequired,
  isIncoming: PropTypes.bool,
};

RingdownDetails.defaultProps = {
  className: null,
  isIncoming: false,
};

export default RingdownDetails;
