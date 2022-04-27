import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';

import FormInput from '../../Components/FormInput';
import FormCheckbox from '../../Components/FormCheckbox';
import FormError from '../../Models/FormError';
import ApiService from '../../ApiService';
import Context from '../../Context';

function UserInfo({ userId }) {
  const history = useHistory();
  const { hospital } = useContext(Context);
  const [user, setUser] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    if (userId && userId !== 'new') {
      ApiService.users.get(userId).then((response) => {
        const { data } = response;
        if (hospital) {
          const hospitalUser = data.activeHospitals?.find((ahu) => ahu.hospital?.id === hospital.hospital?.id);
          data.isActive = hospitalUser.isActive;
          data.isInfoUser = hospitalUser.isInfoUser;
          data.isRingdownUser = hospitalUser.isRingdownUser;
        }
        setUser(response.data);
      });
    } else {
      const data = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        isAdminUser: false,
        isOperationalUser: true,
      };
      if (hospital) {
        data.isActive = true;
        data.isInfoUser = true;
        data.isRingdownUser = true;
      }
      setUser(data);
    }
  }, [userId, hospital]);

  function onChange(property, value) {
    const newUser = { ...user };
    newUser[property] = value;
    setUser(newUser);
  }

  async function onSubmit(event) {
    event.preventDefault();
    try {
      setError();
      const data = { ...user };
      if (data.password === '') {
        delete data.password;
      }
      if (userId && userId !== 'new') {
        await ApiService.users.update(userId, data);
      } else {
        await ApiService.users.create(data);
      }
      history.push('/admin/users', { flash: { info: 'Saved!' } });
    } catch (err) {
      setError(new FormError(err));
      window.scrollTo(0, 0);
    }
  }

  return (
    <>
      {user && (
        <form onSubmit={onSubmit} className="usa-form">
          <div className="grid-row">
            <div className="tablet:grid-col-6">
              {error && (
                <div className="usa-alert usa-alert--slim usa-alert--error">
                  <div className="usa-alert__body">
                    <p className="usa-alert__text">{error.message}</p>
                  </div>
                </div>
              )}
              <fieldset className="usa-fieldset">
                <FormInput
                  label="First Name"
                  onChange={onChange}
                  property="firstName"
                  required
                  showRequiredHint
                  type="text"
                  value={user.firstName}
                  error={error}
                />
                <FormInput
                  label="Last Name"
                  onChange={onChange}
                  property="lastName"
                  required
                  showRequiredHint
                  type="text"
                  value={user.lastName}
                  error={error}
                />
                <FormInput
                  label="Email"
                  onChange={onChange}
                  property="email"
                  required
                  showRequiredHint
                  type="text"
                  value={user.email}
                  error={error}
                />
                <FormInput
                  label="Password"
                  onChange={onChange}
                  property="password"
                  required={!userId || userId === 'new'}
                  showRequiredHint
                  type="password"
                  value={user.password}
                  error={error}
                />
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label className="usa-label">Role</label>
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
                {hospital && (
                  <>
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label className="usa-label">Tabs</label>
                    <FormCheckbox label="Info tab" onChange={onChange} property="isInfoUser" currentValue={user.isInfoUser} value={true} />
                    <FormCheckbox
                      label="Ringdowns tab"
                      onChange={onChange}
                      property="isRingdownUser"
                      currentValue={user.isRingdownUser}
                      value={true}
                    />
                  </>
                )}
                <button className="usa-button margin-y-3" type="submit">
                  Submit
                </button>
              </fieldset>
            </div>
          </div>
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
