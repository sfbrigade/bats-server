import React, { useState } from 'react';

import Heading from '../../Components/Heading';

export default function ErDashboard({ more }) {

    return (
        <div className="margin-left-5">
            <div >
            <Heading title="Active Nurses" />
            <table >
                <tr>
                    <th className="padding-2 margin-3">Status</th>
                    <th className="padding-2 margin-3">Name</th>
                    <th className="padding-2 margin-3">Shift</th>
                    
                </tr>
                <tr>
                    <td className="padding-2 margin-3">Active</td>
                    <td className="padding-2 margin-3">Molly Jane</td>
                    <td className="padding-2 margin-3">Day shift</td>
                    <td className="padding-2 margin-3"><button onClick={() => more()}>More</button></td>
                </tr>
                <tr>
                    <td className="padding-2 margin-3">Inactive</td>
                    <td className="padding-2 margin-3">John Doe</td>
                    <td className="padding-2 margin-3">Day shift</td>
                    <td className="padding-2 margin-3"><button onClick={() => more()}>More</button></td>
                </tr>
                <tr>
                    <td className="padding-2 margin-3">Inactive</td>
                    <td className="padding-2 margin-3">Cindy Moton</td>
                    <td className="padding-2 margin-3">mid shift</td>
                    <td className="padding-2 margin-3"><button onClick={() => more()}>More</button></td>     
                </tr>
                </table>
            </div>

            <div>
            <Heading title="Incoming Ringdowns" />
            </div>
        </div>
    );
}