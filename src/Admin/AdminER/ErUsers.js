import React, { useState } from 'react';

import PropTypes from 'prop-types';
import UserInfo from './UserInfo';
import ErUsersTable from './ErUsersTable';

export default function ErUsers({ users, mainUser }) {
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
      {showMore === false && <ErUsersTable more={More} users={users} mainUser={mainUser} />}
    </div>
  );
}
