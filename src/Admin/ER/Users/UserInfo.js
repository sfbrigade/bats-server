import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';

import FormInput from '../../../Components/FormInput';
import FormCheckbox from '../../../Components/FormCheckbox';
import ApiService from '../../../ApiService';

function UserInfo({ userId }) {
  const history = useHistory();
  const [user, setUser] = useState();

  useEffect(() => {
    if (userId) {
      ApiService.users.get(userId).then((response) => setUser(response.data));
    } else {
      setUser({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        isAdminUser: null,
        isOperationalUser: null,
      });
    }
  }, [userId]);

  function onChange(property, value) {
    const newUser = { ...user };
    newUser[property] = value;
    setUser(newUser);
  }

  async function onSubmit(event) {
    event.preventDefault();
    try {
      if (userId) {
        await ApiService.users.update(userId, user);
      } else {
        await ApiService.users.create(user);
      }
      history.push('/admin/er/users');
    } catch (err) {
      // console.log(err);
    }
  }

  return (
    <>
      {user && (
        <form onSubmit={onSubmit}>
          <fieldset>
            <div className="grid-container">
              <div className="display-flex flex-row flex-justify">
                <div className="grid-col">
                  <FormInput
                    label="First Name"
                    onChange={onChange}
                    property="firstName"
                    required
                    showRequiredHint
                    size="medium"
                    type="text"
                    value={user.firstName}
                  />
                  <FormInput
                    label="Last Name"
                    onChange={onChange}
                    property="lastName"
                    required
                    showRequiredHint
                    size="medium"
                    type="text"
                    value={user.lastName}
                  />
                  <FormInput
                    label="Email"
                    onChange={onChange}
                    property="email"
                    required
                    showRequiredHint
                    size="medium"
                    type="text"
                    value={user.email}
                  />
                  <FormInput
                    label="Password"
                    onChange={onChange}
                    property="password"
                    showRequiredHint
                    size="medium"
                    type="password"
                    value={user.password}
                  />
                </div>
                <div className="grid-col margin-left-9 padding-left-5">
                  <FormCheckbox
                    label="Administrative"
                    onChange={onChange}
                    property="isAdminUser"
                    currentValue={user.isAdminUser}
                    value={true}
                  />
                  <FormCheckbox
                    label="Operational"
                    onChange={onChange}
                    property="isOperationalUser"
                    currentValue={user.isOperationalUser}
                    value={true}
                  />
                  <button className="usa-button margin-y-3" type="submit">
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </fieldset>
        </form>
      )}
    </>
  );
}
UserInfo.propTypes = {
  userId: PropTypes.string,
};
UserInfo.defaultProps = {
  userId: undefined,
};
export default UserInfo;
