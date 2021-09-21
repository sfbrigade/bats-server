import React from 'react';

import Heading from '../../Components/Heading';

export default function ErDashboardTable({ more }) {

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
            <tr className="bg-gray-30 text-base-lightest">
                <td className="padding-2">Active</td>
                <td className="padding-2">Molly Jane</td>
                <td className="padding-2">Day shift</td>
                <td className="padding-2"><button className="bg-gray-30 text-base-lightest border-0" onClick={() => more()}>More &gt;</button></td>
            </tr>
            <tr>
                <td className="padding-2">Inactive</td>
                <td className="padding-2">John Doe</td>
                <td className="padding-2">Day shift</td>
                <td className="padding-2"><button className="bg-white border-0" onClick={() => more()}>More &gt;</button></td>
            </tr>
            <tr className="bg-gray-30 text-base-lightest">
                <td className="padding-2">Inactive</td>
                <td className="padding-2">Cindy Moton</td>
                <td className="padding-2">mid shift</td>
                <td className="padding-2"><button className="bg-gray-30 text-base-lightest border-0"  onClick={() => more()}>More &gt;</button></td>     
            </tr>
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