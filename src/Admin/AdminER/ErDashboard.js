import React, { useState } from 'react';

import UserInfo from './UserInfo';
import ErDashboardTable from './ErDashboardTable';


export default function ErDashboard({ users, mainUser }) {
    const [showMore, setShowMore] = useState(false);
    const [user, setUser] = useState(null);

    const More = (user) => {
        setShowMore(true);
        setUser(user)
      }

      const Back = () => {
        setShowMore(false);
      }

    return (
        <div className="margin-left-9 padding-left-2">
            {showMore === true && <UserInfo back={Back} user={user} />}
            {showMore === false && <ErDashboardTable more={More} users={users} mainUser={mainUser} />}
        </div>
    );
}