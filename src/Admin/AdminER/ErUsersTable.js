import React from 'react';
import PropTypes from 'prop-types';

import Heading from '../../Components/Heading';

export default function ErUsersTable({ more, users }) {

    const userRows = [];
    let temp = null;

    for ( let i = 0; i < users.length; i++ ) {
        if ( users[i].lastName === 'Healthcare'){
        temp = <tr className="bg-gray-30 text-base-lightest">
                <td className="padding-2">{users[i].firstName}</td>
                <td className="padding-2">{users[i].email}</td>
                <td className="padding-2"><button className="bg-gray-30 text-base-lightest border-0" onClick={() => more()}>More &gt;</button></td>
            </tr>

        }
        userRows.push(temp);    
    }

    console.log("users table", users)

   return (
         <div className="margin-y-5">
        {/* will need a different header for this page */}
        <Heading title="Active" />
        <table cellspacing="0" cellpadding="0">
            <tr >
               
                <th className="padding-2">Name</th>
                <th className="padding-2">Email</th>
               
            </tr>
            {userRows}
     
            </table>
        </div>
        );
}
ErUsersTable.propTypes = {
    more: PropTypes.func.isRequired
}