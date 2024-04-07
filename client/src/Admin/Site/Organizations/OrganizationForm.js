import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import FormInput from '../../../Components/FormInput';
import FormCheckbox from '../../../Components/FormCheckbox';
import FormComboBox from '../../../Components/FormComboBox';
import FormError from '../../../Models/FormError';
import ApiService from '../../../ApiService';

function OrganizationForm() {
  const navigate = useNavigate();
  const { orgId } = useParams();
  const [data, setData] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    if (orgId && orgId !== 'new') {
      ApiService.organizations.get(orgId).then((response) => setData(response.data));
    } else {
      const data = {
        name: '',
        type: 'EMS',
        state: '06',
        stateUniqueId: '',
        timeZoneIsoCode: 'PST',
        isMfaEnabled: false,
        isActive: true,
      };
      setData(data);
    }
  }, [orgId]);

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
      if (orgId && orgId !== 'new') {
        await ApiService.organizations.update(orgId, data);
        info = 'Organization updated!';
      } else {
        await ApiService.organizations.create(data);
        info = 'Organization created!';
      }
      navigate(`/admin/site/organizations`, { state: { flash: { info } } });
    } catch (err) {
      setError(new FormError(err));
      window.scrollTo(0, 0);
    }
  }

  return (
    <main>
      <h1>Organization</h1>
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
                  label="Type"
                  property="type"
                  isFreeFormDisabled
                  onChange={onChange}
                  options={[
                    <option key="EMS" value="EMS">
                      EMS
                    </option>,
                    <option key="HEALTHCARE" value="HEALTHCARE">
                      Healthcare
                    </option>,
                  ]}
                  required
                  value={data.type}
                />
                <FormComboBox
                  className="margin-top-4"
                  label="State"
                  property="state"
                  isFreeFormDisabled
                  onChange={onChange}
                  options={[
                    <option key="06" value="06">
                      California
                    </option>,
                  ]}
                  value={data.state ?? ''}
                />
                <FormInput
                  label="State Unique Id"
                  onChange={onChange}
                  property="stateUniqueId"
                  type="text"
                  value={data.stateUniqueId ?? ''}
                  error={error}
                />
                <FormComboBox
                  className="margin-top-4"
                  label="Time Zone"
                  property="timeZoneIsoCode"
                  isFreeFormDisabled
                  onChange={onChange}
                  options={[
                    <option key="PST" value="PST">
                      PST
                    </option>,
                  ]}
                  required
                  value={data.timeZoneIsoCode}
                />
                <div className="margin-top-4">
                  <FormCheckbox
                    label="Require Multifactor Authentication"
                    property="isMfaEnabled"
                    onChange={onChange}
                    currentValue={data.isMfaEnabled}
                  />
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

export default OrganizationForm;
