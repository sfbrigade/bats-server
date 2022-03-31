import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';

import FormInput from '../../../Components/FormInput';
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
            <button className="usa-button margin-y-3" type="submit">
              Submit
            </button>
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
