import React, { useState } from 'react';

import UserInfo from './UserInfo';
import ErDashboardTable from './ErDashboardTable';

import './ErDashboard.scss';

export default function ErDashboard() {
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
            {showMore === false && <ErDashboardTable more={More} />}
        </div>
    );
}