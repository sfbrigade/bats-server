import React from 'react';
import PropTypes from 'prop-types';

import Heading from '../../Components/Heading';

import './ErDashboardTable.scss';

export default function ErDashboardTable({ more, users, mainUser }) {
  //may be able to replace mainUser with user
  const userRows = [];
  let temp = null;

  for (const user of users) {
    
    if (user.organization.id === mainUser.organization.id && !user.isAdminUser) {
      temp = (
        <tr>
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

  return (
    <div>
      <div className="margin-y-5">
        <Heading title="Active Nurses" />
        <table cellSpacing="0" cellPadding="0">
          <tr>
            <th className="padding-2">Status</th>
            <th className="padding-2">Name</th>
          </tr>
          {userRows}
        </table>
      </div>

      <div className="margin-y-5">
        <Heading title="Incoming Ringdowns" />

        <table cellSpacing="0" cellPadding="0">
          <tr>
            <th className="padding-2">ETA</th>
            <th className="padding-2">Status</th>
            <th className="padding-2">Ambulance #</th>
            <th className="padding-2">Chief Complaint</th>
          </tr>
          <tr className>
            <td className="padding-2 row-border">10 min</td>
            <td className="padding-2 row-border">On the way</td>
            <td className="padding-2 row-border">5678</td>
            <td className="padding-2 row-border">Headache</td>
            <td className="padding-2 row-border">
              <button type="button" className="bg-white border-0">
                More &gt;
              </button>
            </td>
          </tr>
          <tr>
            <td className="padding-2 row-border">5min</td>
            <td className="padding-2 row-border">Offloading</td>
            <td className="padding-2 row-border">4567</td>
            <td className="padding-2 row-border">Headache</td>
            <td className="padding-2 row-border">
              <button type="button" className="bg-white border-0">
                More &gt;
              </button>
            </td>
          </tr>
          <tr >
            <td className="padding-2 row-border">2 min</td>
            <td className="padding-2 row-border">Waiting</td>
            <td className="padding-2 row-border">4327</td>
            <td className="padding-2 row-border">Headache</td>
            <td className="padding-2 row-border">
              <button type="button" className="bg-white border-0">
                More &gt;
              </button>
            </td>
          </tr>
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
