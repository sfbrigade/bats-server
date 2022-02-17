import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ApiService from '../../ApiService';

import User from '../../Models/User';

import UserFields from '../UserFields';

export default function UserInfo({ back, user }) {
  const [updatedUser, setUpdatedUser] = useState(new User(user));

  const handleChange = (property, value) => {
    updatedUser.payload[property] = value;
    setUpdatedUser(new User(updatedUser.payload));
  };

  const send = () => {
    // api call update for current user
    try {
      ApiService.users.update(updatedUser.toJson());
      back();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('updating', error.request);
    }
  };
  const deleteUser = () => {
    try {
      ApiService.users.deleteUser(user.email);
      back();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('request', error.request);
    }
  };

  return (
    <div className="margin-x-9 margin-top-4 padding-x-9">
      <div>
        <button type="button" onClick={() => back()}>
          <h1 className="display-inline margin-right-9 "> &lt; Back </h1>
        </button>
        <button
          type="button"
          className="usa-button usa-button--outline usa-button--secondary width-card-lg display-inline margin-left-9 positon-relative right-3"
          onClick={() => deleteUser()}
        >
          Delete User
        </button>
      </div>

      <UserFields user={updatedUser.payload} handleChange={handleChange} />
      <button className="usa-button width-card-lg margin-2" type="button" onClick={() => send()}>
        Save Changes
      </button>
      <button className="usa-button width-card-lg margin-2" type="button" onClick={() => back()}>
        Cancel
      </button>
    </div>
  );
}
UserInfo.propTypes = {
  back: PropTypes.func.isRequired,
  user: PropTypes.shape({
    email: PropTypes.string,
    firstName: PropTypes.string,
    id: PropTypes.string,
    isActive: PropTypes.bool,
    isAdminUser: PropTypes.bool,
    isOperationalUser: PropTypes.bool,
    isSuperUser: PropTypes.bool,
    lastName: PropTypes.string,
  }).isRequired,
};
