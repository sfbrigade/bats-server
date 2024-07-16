import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

import FormInput from '../../Components/FormInput';
import FormCheckbox from '../../Components/FormCheckbox';
import FormComboBox from '../../Components/FormComboBox';
import FormError from '../../Models/FormError';
import ApiService from '../../ApiService';
import Context from '../../Context';

function UserForm() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { organization } = useContext(Context);
  const [user, setUser] = useState();
  const [error, setError] = useState();

  const [hospitals, setHospitals] = useState();
  const [selectedHospitalId, setSelectedHospitalId] = useState();
  const [hospitalUsers, setHospitalUsers] = useState();

  useEffect(() => {
    if (organization) {
      ApiService.hospitals.index({ organizationId: organization.id }).then((response) => setHospitals(response.data));
    }
    if (userId && userId !== 'new') {
      ApiService.users
        .get(userId, { organizationId: organization?.id })
        .then((response) => {
          const { data } = response;
          if (data.organization?.id !== organization?.id) {
            navigate('/admin/users');
          }
          setUser(response.data);
        })
        .then(() => ApiService.hospitalUsers.index({ userId }))
        .then((response) => setHospitalUsers(response.data))
        .catch(() => {
          navigate('/admin/users');
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
      setUser(data);
    }
  }, [userId, organization, navigate]);

  function onChange(property, value) {
    const newUser = { ...user };
    newUser[property] = value;
    setUser(newUser);
  }

  async function onSubmit(event) {
    event.preventDefault();
    try {
      setError();
      const data = {
        ...user,
        organizationId: organization.id,
      };
      if (data.password === '') {
        delete data.password;
      }
      if (userId && userId !== 'new') {
        await ApiService.users.update(userId, data);
        navigate('/admin/users', { state: { flash: { info: 'Saved!' } } });
      } else {
        const response = await ApiService.users.create(data);
        navigate(`/admin/users/${response.data.id}`, { state: { flash: { info: 'Created!' } } });
      }
    } catch (err) {
      setError(new FormError(err));
      window.scrollTo(0, 0);
    }
  }

  async function onChangeHospitalUser(hu, property, newValue) {
    try {
      await ApiService.hospitalUsers.update(hu.id, { [property]: newValue });
      hu[property] = newValue;
      setHospitalUsers([...hospitalUsers]);
    } catch {
      // TODO: display an alert
    }
  }

  async function onAddHospital() {
    if (!selectedHospitalId || hospitalUsers.find((hu) => hu.hospital.id === selectedHospitalId)) {
      return;
    }
    try {
      const response = await ApiService.hospitalUsers.create({ hospitalId: selectedHospitalId, userId });
      setHospitalUsers([...hospitalUsers, response.data]);
      setSelectedHospitalId();
    } catch {
      // TODO: display an alert
    }
  }

  return (
    <main>
      <h1>User</h1>
      {user && (
        <>
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
                  <FormCheckbox label="Administrative" onChange={onChange} property="isAdminUser" currentValue={user.isAdminUser} />
                  <FormCheckbox
                    label="Operational"
                    onChange={onChange}
                    property="isOperationalUser"
                    currentValue={user.isOperationalUser}
                  />
                  <button className="usa-button margin-y-3" type="submit">
                    Submit
                  </button>
                </fieldset>
              </div>
            </div>
          </form>
          {userId !== 'new' && organization?.type === 'HEALTHCARE' && (
            <>
              <h2>Hospitals</h2>
              <table className="usa-table usa-table--striped usa-table--hoverable usa-table--borderless width-full">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th className="w-20">Is Active?</th>
                    <th className="w-20">Is Info User?</th>
                    <th className="w-20">Is Ringdown User?</th>
                  </tr>
                </thead>
                <tbody>
                  {hospitalUsers?.map((hu) => (
                    <tr key={hu.id}>
                      <td>{hu.hospital?.name}</td>
                      <td className="w-20">
                        <FormCheckbox
                          className="margin-0-important"
                          id={`isActive[${hu.id}]`}
                          label="&nbsp;"
                          onChange={(property, value) => onChangeHospitalUser(hu, property, value)}
                          property="isActive"
                          currentValue={hu.isActive}
                        />
                      </td>
                      <td className="w-20">
                        <FormCheckbox
                          className="margin-0-important"
                          id={`isInfoUser[${hu.id}]`}
                          label="&nbsp;"
                          onChange={(property, value) => onChangeHospitalUser(hu, property, value)}
                          property="isInfoUser"
                          currentValue={hu.isInfoUser}
                        />
                      </td>
                      <td className="w-20">
                        <FormCheckbox
                          className="margin-0-important"
                          id={`isRingdownUser[${hu.id}]`}
                          label="&nbsp;"
                          onChange={(property, value) => onChangeHospitalUser(hu, property, value)}
                          property="isRingdownUser"
                          currentValue={hu.isRingdownUser}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td>
                      <FormComboBox
                        label=""
                        required={false}
                        property="selectedHospitalId"
                        isFreeFormDisabled
                        onChange={(_, newValue) => setSelectedHospitalId(newValue)}
                        options={hospitals?.map((h) => (
                          <option key={h.id} value={h.id}>
                            {h.name}
                          </option>
                        ))}
                        value={selectedHospitalId ?? ''}
                      />
                    </td>
                    <td colSpan="3">
                      <button disabled={!selectedHospitalId} onClick={onAddHospital} className="usa-button margin-top-1" type="button">
                        Add
                      </button>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </>
          )}
        </>
      )}
    </main>
  );
}
UserForm.propTypes = {
  userId: PropTypes.string,
};
UserForm.defaultProps = {
  userId: undefined,
};
export default UserForm;
