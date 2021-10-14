import React from 'react';
import PropTypes from 'prop-types';
import ApiService from '../../ApiService';

import UserFields from '../UserFields';

export default function UserInfo({ back, user }) {
  const send = () => {
    // api call update for current user
  };
  const deleteUser = () => {
    // console.log(user.id)
    // ApiService.users.deleteUser(user.id)
    // .then((response) => { 
    //   alert("user deleted")
    //    back()
    // })
    // .catch((error) => {
    //    // eslint-disable-next-line no-console
    //    console.log("request", error.request)
    // }); 
  }

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

      <UserFields user={user} />
      <button className="usa-button width-card-lg margin-2" type="button" onClick={send}>
        Save Changes
      </button>
      <button className="usa-button width-card-lg margin-2" type="button" onClick={deleteUser}>
        Cancel
      </button>
    </div>
  );
}
UserInfo.propTypes = {
  back: PropTypes.func.isRequired,
};
