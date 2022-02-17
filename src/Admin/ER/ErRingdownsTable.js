import React from 'react';
import PropTypes from 'prop-types';

import './ErRingdownsTable.scss';

export default function ErRingdownsTable({ more, allRingdowns }) {
  return (
    <div>
      <span>
        <button type="button" className="bg-white border-0 border-bottom margin-x-2">
          Today
        </button>
        <button type="button" className="bg-white border-0 border-bottom margin-x-2">
          This Week
        </button>
        <button type="button" className="bg-white border-0 border-bottom margin-x-2">
          This Month
        </button>
        <input type="date" />
      </span>
      <h2>Ringdown History</h2>
      <table cellSpacing="0" cellPadding="0">
        <tbody>
          <tr>
            <th className="padding-2">Time</th>
            <th className="padding-2">Ambulance #</th>
            <th className="padding-2">Incident #</th>
            <th className="padding-2">Show details</th>
          </tr>
          {allRingdowns.map((ringdown) => (
            <tr>
              <td className="padding-2 row-border">{ringdown.patientDelivery.currentDeliveryStatusDateTimeLocal}</td>
              <td className="padding-2 row-border">{ringdown.ambulance.ambulanceIdentifier}</td>
              <td className="padding-2 row-border">{ringdown.emsCall.dispatchCallNumber}</td>
              <td className="padding-2 row-border">{ringdown.patient.cheifComplaintDescription}</td>
              <td className="padding-2 row-border">
                <button type="button" className="bg-white border-0" onClick={() => more()}>
                  !
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
ErRingdownsTable.propTypes = {
  more: PropTypes.func.isRequired,
  allRingdowns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      ambulance: PropTypes.shape({
        ambulanceIdentifier: PropTypes.string,
      }),
      emsCall: PropTypes.shape({
        dispatchCallNumber: PropTypes.number,
      }),
      hospital: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
      }),
      patient: PropTypes.shape({
        age: PropTypes.number,
        sex: PropTypes.string,
        emergencyServiceResponseType: PropTypes.string,
      }),
      patientDelivery: PropTypes.shape({
        currentDeliveryStatus: PropTypes.string,
        currentDeliveryStatusDateTimeLocal: PropTypes.string,
        etaMinutes: PropTypes.number,
        timestamps: PropTypes.shape({
          ARRIVED: PropTypes.string,
          'RINGDOWN RECEIVED': PropTypes.string,
          'RINGDOWN SENT': PropTypes.string,
        }),
      }),
    })
  ).isRequired,
};
