import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './ErDashboardTable.scss';

export default function ErDashboardTable({ more, users, mainUser, allRingdowns }) {
  const [usersList, setUsersList] = useState(users)
  return (
    <div>
      <div>
        <h2>Active Nurses</h2>
        <table cellSpacing="0" cellPadding="0">
          <tbody>
            <tr>
              <th className="padding-2">
                First Name <button type="button">^</button>
              </th>
              <th className="padding-2">
                Last Name <button type="button">^</button>
              </th>
              <th className="padding-2">
                Email <button type="button">^</button>
              </th>
            </tr>
            {usersList.map((user) =>
              user.organization.id === mainUser.organization.id && !user.isAdminUser ? (
                <tr>
                  <td className="padding-2 row-border">{user.firstName}</td>
                  <td className="padding-2 row-border">{user.lastName}</td>
                  <td className="padding-2 row-border">{user.email}</td>
                  <td className="padding-2 row-border">
                    <button type="button" className="border-0 bg-white" onClick={() => more(user)}>
                      More &gt;
                    </button>
                  </td>
                </tr>
              ) : null
            )}
          </tbody>
        </table>
      </div>

      <div>
        <h2>Incoming Ringdowns</h2>
        <table cellSpacing="0" cellPadding="0">
          <tbody>
            <tr>
              <th className="padding-2">ETA</th>
              <th className="padding-2">Status</th>
              <th className="padding-2">Ambulance #</th>
              <th className="padding-2">Chief Complaint</th>
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
    </div>
  );
}
ErDashboardTable.propTypes = {
  more: PropTypes.func.isRequired,
  users: PropTypes.shape({
    email: PropTypes.string,
    firstName: PropTypes.string,
    id: PropTypes.string,
    isActive: PropTypes.bool,
    isAdminUser: PropTypes.bool,
    isOperationalUser: PropTypes.bool,
    isSuperUser: PropTypes.bool,
    lastName: PropTypes.string,
  }).isRequired,

  mainUser: PropTypes.shape({
    email: PropTypes.string,
    firstName: PropTypes.string,
    id: PropTypes.string,
    isActive: PropTypes.bool,
    isAdminUser: PropTypes.bool,
    isOperationalUser: PropTypes.bool,
    isSuperUser: PropTypes.bool,
    lastName: PropTypes.string,
    organization: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      type: PropTypes.string,
    }),
  }).isRequired,
  allRingdowns: PropTypes.shape({
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
  }).isRequired,
};
