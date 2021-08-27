import React from 'react';
import PropTypes from 'prop-types';


import "./AdminUser.scss";


export default function AdminUser({ userName, userId, userEmail, userType, userOrganization, background }){

    return (
        
        <div className={`margin-1 padding-1 admin__user grid-row ${background}`}>
          
            <div className="grid-col-2 admin__user__name">
                {userName}
            </div>
            <div className="grid-col-2">
                {userId}
            </div>
            <div className="grid-col-4">
                {userEmail}
            </div>
            <div className="grid-col-2">
                {userType}
            </div>
            <div className="grid-col-2">
                {userOrganization}
            </div>
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