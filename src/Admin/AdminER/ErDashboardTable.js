import React from 'react';
import PropTypes from 'prop-types';

import Heading from '../../Components/Heading';

export default function ErDashboardTable({ more, users, mainUser }) {

    const userRows = [];
    let temp = null;

    for ( const user of users) {
        if ( user.organization.id === mainUser.organization.id){
        temp = <tr>
                <td className="padding-2 row-border">{user.firstName}</td>
                <td className="padding-2 row-border">{user.email}</td>
                <td className="padding-2 row-border"><button className="border-0 bg-white" onClick={() => more(user)}>More &gt;</button></td>
            </tr>

        }
        if (userRows.indexOf(temp) === -1) {
            userRows.push(temp);  
              }
    }

    return (
        <div>
        <div className="margin-y-5">
        <Heading title="Active Nurses" />
        <table cellspacing="0" cellpadding="0">
            <tr >
                <th className="padding-2">Status</th>
                <th className="padding-2">Name</th>
                <th className="padding-2">Shift</th>
                
            </tr>
            {userRows}
            </table>
        </div>

        <div className="margin-y-5">
        <Heading title="Incoming Ringdowns" />

        <table cellspacing="0" cellpadding="0">
            <tr >
                <th className="padding-2">ETA</th>
                <th className="padding-2">Status</th>
                <th className="padding-2">Ambulance #</th>
                <th className="padding-2">Chief Complaint</th>
                
            </tr>
            <tr className="bg-gray-30 text-base-lightest">
                <td className="padding-2">10 min</td>
                <td className="padding-2">On the way</td>
                <td className="padding-2">5678</td>
                <td className="padding-2"><button className="bg-gray-30 text-base-lightest border-0" >More &gt;</button></td>
            </tr>
            <tr>
                <td className="padding-2">5min</td>
                <td className="padding-2">Offloading</td>
                <td className="padding-2">4567</td>
                <td className="padding-2"><button className="bg-white border-0" >More &gt;</button></td>
            </tr>
            <tr className="bg-gray-30 text-base-lightest">
                <td className="padding-2">2 min</td>
                <td className="padding-2">Waiting</td>
                <td className="padding-2">4327</td>
                <td className="padding-2"><button className="bg-gray-30 text-base-lightest border-0" >More &gt;</button></td>     
            </tr>
            </table>
        </div>
        </div>
    )
}
ErDashboardTable.propTypes = {
    more: PropTypes.func.isRequired
  };
  ErDashboardTable.defaultProps = {
    more: null,
  };