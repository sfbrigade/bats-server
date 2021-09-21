import React from 'react';

import Heading from '../../Components/Heading';

export default function ErRingdownsTable({ more }) {

    return (

        <div className="margin-y-5">
        <Heading title="Ringdown History" />
        <table cellspacing="0" cellpadding="0">
            <tr >
                <th className="padding-2">Time</th>
                <th className="padding-2">Ambulance #</th>
                <th className="padding-2">Incident #</th>
                <th className="padding-2">Show details</th>
            </tr>
            <tr className="bg-gray-30 text-base-lightest">
                <td className="padding-2">5:30 am</td>
                <td className="padding-2">9876</td>
                <td className="padding-2">38654</td>
                <td className="padding-2"><button className="bg-gray-30 text-base-lightest border-0" onClick={() => more()}>!</button></td>
            </tr>
            <tr>
                <td className="padding-2">7:30 pm</td>
                <td className="padding-2">4563</td>
                <td className="padding-2">48867</td>
                <td className="padding-2"><button className="bg-white border-0" onClick={() => more()}>!</button></td>
            </tr>
            <tr className="bg-gray-30 text-base-lightest">
                <td className="padding-2">8:30 am</td>
                <td className="padding-2">3957</td>
                <td className="padding-2">48375</td>
                <td className="padding-2"><button className="bg-gray-30 text-base-lightest border-0"  onClick={() => more()}>!</button></td>     
            </tr>
            </table>
        </div>
    )
}