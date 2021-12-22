import React from 'react';
import PropTypes from 'prop-types';

import Heading from '../../Components/Heading';

import './ErDashboardTable.scss';

export default function ErDashboardTable({ more, users, mainUser, allRingdowns }) {
  // may be able to replace mainUser with user
  const userRows = [];
  let temp = null;
  let count = 0;

  for (const user of users) {
    
    if (user.organization.id === mainUser.organization.id && !user.isAdminUser) {
      temp = (
        <tr key={count}>
          <td className="padding-2 row-border">{user.firstName}</td>
          <td className="padding-2 row-border">{user.email}</td>
          <td className="padding-2 row-border">
            <button type="button" className="border-0 bg-white" onClick={() => more(user)}>
              More &gt;
            </button>
          </td>
        </tr>
      );
    }
    if (userRows.indexOf(temp) === -1) {
      userRows.push(temp);
    }
  }

  const ringdownRows = [];
  let Rtemp = null;

  count = 0;
  for (const ringdown of allRingdowns) {
    if (ringdown) {
      
      // console.log("button", ringdown.patient.chiefComplaintDescription);
      Rtemp = (
        <tr key={count}>
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
    if (ringdownRows.indexOf(Rtemp) === -1) {
      ringdownRows.push(Rtemp);
    }
    count += 1;
  }

  return (
    <div>
      <div className="margin-y-5">
        <Heading title="Active Nurses" />
        <table cellSpacing="0" cellPadding="0">
          <tbody>
          <tr>
            <th className="padding-2">Status</th>
            <th className="padding-2">Name</th>
          </tr>
          {userRows}
          </tbody>
        </table>
      </div>

      <div className="margin-y-5">
        <Heading title="Incoming Ringdowns" />

        <table cellSpacing="0" cellPadding="0">
          <tbody>
          <tr>
            <th className="padding-2">ETA</th>
            <th className="padding-2">Status</th>
            <th className="padding-2">Ambulance #</th>
            <th className="padding-2">Chief Complaint</th>
          </tr>
          {ringdownRows}
          </tbody>
        </table>
      </div>
    </div>
  );
}
ErDashboardTable.propTypes = {
  more: PropTypes.func.isRequired,
};
ErDashboardTable.defaultProps = {
  more: null,
};
