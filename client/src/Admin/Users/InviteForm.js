import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import FormInput from '../../Components/FormInput';
import FormCheckbox from '../../Components/FormCheckbox';
import FormComboBox from '../../Components/FormComboBox';
import FormTextArea from '../../Components/FormTextArea';
import FormError from '../../Models/FormError';
import ApiService from '../../ApiService';
import Context from '../../Context';

function InviteForm() {
  const navigate = useNavigate();
  const { organization, user } = useContext(Context);
  const [invite, setInvite] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
    isSuperUser: false,
    isAdminUser: false,
    isOperationalUser: true,
  });
  const [error, setError] = useState();

  const [hospitals, setHospitals] = useState();
  const [selectedHospitalId, setSelectedHospitalId] = useState();
  const [hospitalInvites, setHospitalInvites] = useState([]);

  useEffect(() => {
    if (organization) {
      ApiService.hospitals.index({ organizationId: organization.id }).then((response) => setHospitals(response.data));
    }
  }, [organization]);

  function onChange(property, value) {
    const newInvite = { ...invite };
    newInvite[property] = value;
    setInvite(newInvite);
  }

  async function onSubmit(event) {
    event.preventDefault();
    try {
      setError();
      const data = {
        ...invite,
        OrganizationId: organization.id,
        HospitalInvites: hospitalInvites,
      };
      await ApiService.invites.create(data);
      navigate(`/admin/users`, { state: { flash: { info: 'Invited!' } } });
    } catch (err) {
      setError(new FormError(err));
      window.scrollTo(0, 0);
    }
  }

  async function onChangeHospitalInvite(hi, property, newValue) {
    hi[property] = newValue;
    setHospitalInvites([...hospitalInvites]);
  }

  async function onAddHospital() {
    if (!selectedHospitalId || hospitalInvites.find((hi) => hi.hospital.id === selectedHospitalId)) {
      return;
    }
    const hospital = hospitals.find((h) => h.id === selectedHospitalId);
    setHospitalInvites([
      ...hospitalInvites,
      {
        hospital,
        HospitalId: selectedHospitalId,
        isActive: true,
        isInfoUser: true,
        isRingdownUser: true,
      },
    ]);
    setSelectedHospitalId();
  }

  return (
    <main>
      <h1>Invite New User</h1>
      {invite && (
        <>
          <form onSubmit={onSubmit} className="usa-form">
            <fieldset className="usa-fieldset">
              <div className="grid-row">
                <div className="tablet:grid-col-6">
                  {error && (
                    <div className="usa-alert usa-alert--slim usa-alert--error">
                      <div className="usa-alert__body">
                        <p className="usa-alert__text">{error.message}</p>
                      </div>
                    </div>
                  )}
                  <FormInput
                    label="First Name"
                    onChange={onChange}
                    property="firstName"
                    type="text"
                    value={invite.firstName}
                    error={error}
                  />
                  <FormInput label="Last Name" onChange={onChange} property="lastName" type="text" value={invite.lastName} error={error} />
                  <FormInput
                    label="Email"
                    onChange={onChange}
                    property="email"
                    required
                    showRequiredHint
                    type="text"
                    value={invite.email}
                    error={error}
                  />
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                  <label className="usa-label">Role</label>
                  {user?.isSuperUser && (
                    <FormCheckbox label="Super User" onChange={onChange} property="isSuperUser" currentValue={invite.isSuperUser} />
                  )}
                  <FormCheckbox label="Administrative" onChange={onChange} property="isAdminUser" currentValue={invite.isAdminUser} />
                  <FormCheckbox
                    label="Operational"
                    onChange={onChange}
                    property="isOperationalUser"
                    currentValue={invite.isOperationalUser}
                  />
                  <FormTextArea label="Message" onChange={onChange} property="message" type="text" value={invite.message} error={error} />
                </div>
                {organization?.type === 'HEALTHCARE' && (
                  <div className="tablet:grid-col-12">
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
                        {hospitalInvites?.map((hi) => (
                          <tr key={hi.id}>
                            <td>{hi.hospital?.name}</td>
                            <td className="w-20">
                              <FormCheckbox
                                className="margin-0-important"
                                id={`isActive[${hi.id}]`}
                                label="&nbsp;"
                                onChange={(property, value) => onChangeHospitalInvite(hi, property, value)}
                                property="isActive"
                                currentValue={hi.isActive}
                              />
                            </td>
                            <td className="w-20">
                              <FormCheckbox
                                className="margin-0-important"
                                id={`isInfoUser[${hi.id}]`}
                                label="&nbsp;"
                                onChange={(property, value) => onChangeHospitalInvite(hi, property, value)}
                                property="isInfoUser"
                                currentValue={hi.isInfoUser}
                              />
                            </td>
                            <td className="w-20">
                              <FormCheckbox
                                className="margin-0-important"
                                id={`isRingdownUser[${hi.id}]`}
                                label="&nbsp;"
                                onChange={(property, value) => onChangeHospitalInvite(hi, property, value)}
                                property="isRingdownUser"
                                currentValue={hi.isRingdownUser}
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
                            <button disabled={!selectedHospitalId} onClick={onAddHospital} className="usa-button" type="button">
                              Add
                            </button>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
                <div>
                  <button className="usa-button margin-y-3" type="submit">
                    Submit
                  </button>
                </div>
              </div>
            </fieldset>
          </form>
        </>
      )}
    </main>
  );
}

export default InviteForm;
