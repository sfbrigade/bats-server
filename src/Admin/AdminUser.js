import React from 'react';
import PropTypes from 'prop-types';


import "./AdminUser.scss";


export default function AdminUser({ userName, userId, userEmail, userType, userOrganization, background }){

    return (
        <div className={`margin-1 padding-1 admin__user ${background}`}>
          
            <div className="margin-1 padding-1 admin__user__name">
                {userName}
            </div>
            <div className="margin-1 padding-1">
                {userId}
            </div>
            <div className="margin-1 padding-1">
                {userEmail}
            </div>
            <div className="margin-1 padding-1">
                {userType}
            </div>
            <div className="margin-1 padding-1">
                {userOrganization}
            </div>
            {/* <button>
                edit
            </button> */}

        </div>
    )
}
AdminUser.propTypes = {
    userName: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    userEmail: PropTypes.string.isRequired,
    userType: PropTypes.string.isRequired,
    userOrganization: PropTypes.string.isRequired,
    background: PropTypes.string,
  };
  AdminUser.defaultProps = {
    background: null,
  };