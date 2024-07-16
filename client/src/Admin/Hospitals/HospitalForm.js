import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import State from '../../Models/State';

import FormInput from '../../Components/FormInput';
import FormCheckbox from '../../Components/FormCheckbox';
import FormComboBox from '../../Components/FormComboBox';
import FormError from '../../Models/FormError';
import ApiService from '../../ApiService';
import Context from '../../Context';

function HospitalForm() {
  const navigate = useNavigate();
  const { organization } = useContext(Context);
  const { hospitalId } = useParams();
  const [data, setData] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    if (hospitalId && hospitalId !== 'new') {
      ApiService.hospitals.get(hospitalId).then((response) => setData(response.data));
    } else if (organization) {
      if (organization.type !== 'HEALTHCARE') {
        navigate('/admin');
      } else {
        const data = {
          OrganizationId: organization.id,
          name: '',
          state: '06',
          stateFacilityCode: '',
          isActive: true,
        };
        setData(data);
      }
    }
  }, [organization, navigate, hospitalId]);

  function onChange(property, value) {
    const newData = { ...data };
    newData[property] = value;
    setData(newData);
  }

  async function onSubmit(event) {
    event.preventDefault();
    try {
      setError();
      let info;
      if (hospitalId && hospitalId !== 'new') {
        await ApiService.hospitals.update(hospitalId, data);
        info = 'Hospital updated!';
      } else {
        await ApiService.hospitals.create(data);
        info = 'Hospital created!';
      }
      navigate(`/admin/hospitals`, { state: { flash: { info } } });
    } catch (err) {
      setError(new FormError(err));
      window.scrollTo(0, 0);
    }
  }

  return (
    <main>
      <h1>Hospital</h1>
      {data && (
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
                  label="Name"
                  onChange={onChange}
                  property="name"
                  required
                  showRequiredHint
                  type="text"
                  value={data.name}
                  error={error}
                />
                <FormComboBox
                  className="margin-top-4"
                  label="State"
                  property="state"
                  isFreeFormDisabled
                  onChange={onChange}
                  options={State.ALL_STATES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                  value={data.state ?? ''}
                />
                <FormInput
                  label="State Facility Code"
                  onChange={onChange}
                  property="stateFacilityCode"
                  type="text"
                  value={data.stateFacilityCode ?? ''}
                  error={error}
                />
                <div className="margin-top-4">
                  <FormCheckbox label="Is Active" property="isActive" onChange={onChange} currentValue={data.isActive} />
                </div>
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

export default HospitalForm;
