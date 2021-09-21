import React,  { useEffect, useState } from 'react';

import UserInfo from './UserInfo';
import ErUsersTable from './ErUsersTable';

export default function ErUsers() {
    const [showMore, setShowMore] = useState(false);

    const More = () => {
        setShowMore(true);
      }

      const Back = () => {
        setShowMore(false);
      }    

    return (
        <div className="margin-left-9 padding-left-2">
            {showMore === true && <UserInfo back={Back} />}
            {showMore === false && <ErUsersTable more={More} />}
        </div>
    )
}