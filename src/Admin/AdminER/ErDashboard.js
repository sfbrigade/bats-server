import React, { useState } from 'react';

import Heading from '../../Components/Heading';

export default function ErDashboard({ more }) {

    return (
        <div className="margin-left-5 ">
            <div >
            <Heading title="Active Nurses" />
            <table >
                <tr>
                    <th className="padding-2">Status</th>
                    <th className="padding-2">Name</th>
                    <th className="padding-2">Shift</th>
                    
                </tr>
                <tr className="bg-base text-base-lightest">
                    <td className="padding-2">Active</td>
                    <td className="padding-2">Molly Jane</td>
                    <td className="padding-2">Day shift</td>
                    <td className="padding-2"><button className="bg-base text-base-lightest border-0" onClick={() => more()}>More</button></td>
                </tr>
                <tr className="bg-base text-base-lightest">
                    <td className="padding-2">Inactive</td>
                    <td className="padding-2">John Doe</td>
                    <td className="padding-2">Day shift</td>
                    <td className="padding-2"><button className="bg-base text-base-lightest border-0" onClick={() => more()}>More</button></td>
                </tr>
                <tr className="bg-base text-base-lightest">
                    <td className="padding-2">Inactive</td>
                    <td className="padding-2">Cindy Moton</td>
                    <td className="padding-2">mid shift</td>
                    <td className="padding-2"><button className="bg-base text-base-lightest border-0"  onClick={() => more()}>More</button></td>     
                </tr>
                </table>
            </div>

            <div>
            <Heading title="Incoming Ringdowns" />
            </div>
        </div>
    );
}