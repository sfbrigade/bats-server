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
