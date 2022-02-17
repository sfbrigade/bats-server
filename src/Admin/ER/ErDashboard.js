import React, { useState } from 'react';
import PropTypes from 'prop-types';

import UserInfo from './UserInfo';
import ErDashboardTable from './ErDashboardTable';

export default function ErDashboard({ users, allRingdowns }) {
  const [showMore, setShowMore] = useState(false);
  const [user, setUser] = useState(null);

  const More = (userUpdate) => {
    setShowMore(true);
    setUser(userUpdate);
  };

  const Back = () => {
    setShowMore(false);
  };

  return (
    <div className="margin-left-9 padding-left-2">
      {showMore === true && <UserInfo back={Back} user={user} />}
      {showMore === false && <ErDashboardTable more={More} users={users} allRingdowns={allRingdowns} />}
    </div>
  );
}
ErDashboard.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      email: PropTypes.string,
      firstName: PropTypes.string,
      id: PropTypes.string,
      isActive: PropTypes.bool,
      isAdminUser: PropTypes.bool,
      isOperationalUser: PropTypes.bool,
      isSuperUser: PropTypes.bool,
      lastName: PropTypes.string,
    })
  ).isRequired,

  allRingdowns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      ambulance: PropTypes.shape({
        ambulanceIdentifier: PropTypes.string,
      }),
      emsCall: PropTypes.shape({
        dispatchCallNumber: PropTypes.number,
      }),
      hospital: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
      }),
      patient: PropTypes.shape({
        age: PropTypes.number,
        sex: PropTypes.string,
        emergencyServiceResponseType: PropTypes.string,
      }),
      patientDelivery: PropTypes.shape({
        currentDeliveryStatus: PropTypes.string,
        currentDeliveryStatusDateTimeLocal: PropTypes.string,
        etaMinutes: PropTypes.number,
        timestamps: PropTypes.shape({
          ARRIVED: PropTypes.string,
          'RINGDOWN RECEIVED': PropTypes.string,
          'RINGDOWN SENT': PropTypes.string,
        }),
      }),
    })
  ).isRequired,
};
