import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import PropTypes from 'prop-types';

import FormInput from '../../Components/FormInput';
import FormCheckbox from '../../Components/FormCheckbox';
import FormError from '../../Models/FormError';
import ApiService from '../../ApiService';
import Context from '../../Context';

function MciForm({ mciId }) {
  const navigate = useNavigate();
  const { organization, hospital } = useContext(Context);
  const [mci, setMci] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    if (mciId && mciId !== 'new') {
      ApiService.mcis
        .get(mciId, { organizationId: organization?.id, hospitalId: hospital?.id })
        .then((response) => {
          const { data } = response;
          if (data.organization?.id !== organization?.id) {
            navigate('/admin/mcis');
          }
          if (hospital) {
            const hospitalMci = data.activeHospitals?.find((ahu) => ahu.hospital?.id === hospital?.id);
            if (hospitalMci) {
              data.isActive = hospitalMci.isActive;
              data.isInfoMci = hospitalMci.isInfoMci;
              data.isRingdownMci = hospitalMci.isRingdownMci;
            } else {
              navigate('/admin/mcis');
            }
          }
          setMci(response.data);
        })
        .catch(() => {
          navigate('/admin/mcis');
        });
    } else {
      const data = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        isAdminMci: false,
        isOperationalMci: true,
      };
      if (hospital) {
        data.isActive = true;
        data.isInfoMci = true;
        data.isRingdownMci = true;
      }
      setMci(data);
    }
  }, [mciId, organization, hospital]); // eslint-disable-line react-hooks/exhaustive-deps

  function onChange(property, value) {
    const newMci = { ...mci };
    newMci[property] = value;
    setMci(newMci);
  }

  async function onSubmit(event) {
    event.preventDefault();
    try {
      setError();
      const data = {
        ...mci,
        organizationId: organization.id,
        hospitalId: hospital?.id,
      };
      if (data.password === '') {
        delete data.password;
      }
      if (mciId && mciId !== 'new') {
        await ApiService.mcis.update(mciId, data);
      } else {
        await ApiService.mcis.create(data);
      }
      navigate('/admin/mcis', { state: { flash: { info: 'Saved!' } } });
    } catch (err) {
      setError(new FormError(err));
      window.scrollTo(0, 0);
    }
  }

  return (
    <main>
      <h1>MCI</h1>
      {mci && (
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
                  value={mci.firstName}
                  error={error}
                />
                <FormInput
                  label="Last Name"
                  onChange={onChange}
                  property="lastName"
                  required
                  showRequiredHint
                  type="text"
                  value={mci.lastName}
                  error={error}
                />
                <FormInput
                  label="Email"
                  onChange={onChange}
                  property="email"
                  required
                  showRequiredHint
                  type="text"
                  value={mci.email}
                  error={error}
                />
                <FormInput
                  label="Password"
                  onChange={onChange}
                  property="password"
                  required={!mciId || mciId === 'new'}
                  showRequiredHint
                  type="password"
                  value={mci.password}
                  error={error}
                />
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label className="usa-label">Role</label>
                <FormCheckbox label="Administrative" onChange={onChange} property="isAdminMci" currentValue={mci.isAdminMci} />
                <FormCheckbox label="Operational" onChange={onChange} property="isOperationalMci" currentValue={mci.isOperationalMci} />
                {hospital && (
                  <>
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label className="usa-label">Tabs</label>
                    <FormCheckbox label="Info tab" onChange={onChange} property="isInfoMci" currentValue={mci.isInfoMci} />
                    <FormCheckbox label="Ringdowns tab" onChange={onChange} property="isRingdownMci" currentValue={mci.isRingdownMci} />
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
    </main>
  );
}
MciForm.propTypes = {
  mciId: PropTypes.string,
};
MciForm.defaultProps = {
  mciId: undefined,
};
export default MciForm;
