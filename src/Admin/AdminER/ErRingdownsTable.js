import React from 'react';
import PropTypes from 'prop-types';

import Heading from '../../Components/Heading';

import './ErRingdownsTable.scss';

export default function ErRingdownsTable({ more, allRingdowns }) {
  console.log('in Table', allRingdowns[0])
  const ringdownRows = [];
  let temp = null;

  for (const ringdown of allRingdowns) {
    if (ringdown) {
      // console.log("button", ringdown.patient.chiefComplaintDescription);
      temp = (
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
      );
    }
    if (ringdownRows.indexOf(temp) === -1) {
      ringdownRows.push(temp);
    }
  }

console.log('ringdownRows', ringdownRows);

  return (
    <div className="margin-y-5">
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
      <Heading title="Ringdown History" />

      <table cellSpacing="0" cellPadding="0">
        <tbody>
        <tr>
          <th className="padding-2">
            Time
            <div className="shift">
              <button type="button" className="bg-white border-0">
                &lt;
              </button>
              <button type="button" className="bg-white border-0">
                &gt;
              </button>
            </div>
          </th>
          <th className="padding-2">
            Ambulance #
            <div className="shift">
              <button type="button" className="bg-white border-0">
                &lt;
              </button>
              <button type="button" className="bg-white border-0">
                &gt;
              </button>
            </div>
          </th>
          <th className="padding-2">
            Incident #
            <div className="shift">
              <button type="button" className="bg-white border-0">
                &lt;
              </button>
              <button type="button" className="bg-white border-0">
                &gt;
              </button>
            </div>
          </th>
          <th className="padding-2">Show details</th>
        </tr>
        {ringdownRows}
        </tbody>
      </table>
    </div>
  );
}
ErRingdownsTable.propTypes = {
  more: PropTypes.func.isRequired,
  allRingdowns: PropTypes.array.isRequired
};
