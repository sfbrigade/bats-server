import React from 'react';
import PropTypes from 'prop-types';

import Heading from '../../Components/Heading';

export default function ErUsersTable({ more }) {

   return (
         <div className="margin-y-5">
        {/* will need a different header for this page */}
        <Heading title="Active" />
        <table cellspacing="0" cellpadding="0">
            <tr >
                <th className="padding-2">Status</th>
                <th className="padding-2">Name</th>
                <th className="padding-2">Dept</th>
                <th className="padding-2">Clocked In</th>
                <th className="padding-2">Email</th>
                <th className="padding-2">Phone #</th>
            </tr>
            <tr className="bg-gray-30 text-base-lightest">
                <td className="padding-2">Active</td>
                <td className="padding-2">Molly Jane</td>
                <td className="padding-2">ER</td>
                <td className="padding-2">Y</td>
                <td className="padding-2">molly.jane@email.com</td>
                <td className="padding-2">(123)456-7890</td>
                <td className="padding-2"><button className="bg-gray-30 text-base-lightest border-0" onClick={() => more()}>More &gt;</button></td>
            </tr>
            <tr>
            <td className="padding-2">Active</td>
                <td className="padding-2">Molly Jane</td>
                <td className="padding-2">ER</td>
                <td className="padding-2">Y</td>
                <td className="padding-2">molly.jane@email.com</td>
                <td className="padding-2">(123)456-7890</td>
                <td className="padding-2"><button className="bg-white border-0" onClick={() => more()}>More &gt;</button></td>
            </tr>
            <tr className="bg-gray-30 text-base-lightest">
            <td className="padding-2">Active</td>
                <td className="padding-2">Molly Jane</td>
                <td className="padding-2">ER</td>
                <td className="padding-2">Y</td>
                <td className="padding-2">molly.jane@email.com</td>
                <td className="padding-2">(123)456-7890</td>
                <td className="padding-2"><button className="bg-gray-30 text-base-lightest border-0" onClick={() => more()}>More &gt;</button></td>
            </tr>
            </table>
        </div>
        );
}
ErUsersTable.propTypes = {
    more: PropTypes.func.isRequired
}