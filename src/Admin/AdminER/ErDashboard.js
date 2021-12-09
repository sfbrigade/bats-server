import React, { useState } from 'react';
import PropTypes from 'prop-types';

import UserInfo from './UserInfo';
import ErDashboardTable from './ErDashboardTable';

export default function ErDashboard({ users, mainUser, allRingdowns }) {
  const [showMore, setShowMore] = useState(false);
  const [user, setUser] = useState(null);

  const More = (user) => {
    setShowMore(true);
    setUser(user);
  };

  const Back = () => {
    setShowMore(false);
  };

  return (
    <div className="margin-left-9 padding-left-2">
      {showMore === true && <UserInfo back={Back} user={user} />}
      {showMore === false && <ErDashboardTable more={More} users={users} mainUser={mainUser} allRingdowns={allRingdowns} />}
    </div>
  );
}
ErDashboard.prototypes = {
  users: PropTypes.shape({
    email: PropTypes.string,
    firstName: PropTypes.string,
    id: PropTypes.string,
    isActive: PropTypes.bool,
    isAdminUser: PropTypes.bool,
    isOperationalUser: PropTypes.bool,
    isSuperUser: PropTypes.bool,
    lastName: PropTypes.string,
  }),

  mainUser: PropTypes.shape({
    email: PropTypes.string,
    firstName: PropTypes.string,
    id: PropTypes.string,
    isActive: PropTypes.bool,
    isAdminUser: PropTypes.bool,
    isOperationalUser: PropTypes.bool,
    isSuperUser: PropTypes.bool,
    lastName: PropTypes.string,
  }),
};
