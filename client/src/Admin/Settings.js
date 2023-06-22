import React, { useState, useContext, useEffect } from 'react';

import Context from '../Context';
import ApiService from '../ApiService';
import FormError from '../Models/FormError';
import FormCheckbox from '../Components/FormCheckbox';

import './Settings.scss';

function Settings() {
  const { organization, setOrganization } = useContext(Context);
  const [organizationInEdit, setOrganizationInEdit] = useState(organization);
  const [error, setError] = useState();
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    setOrganizationInEdit(organization);
    setError();
  }, [showEdit]);

  function onChange(property, value) {
    const newOrg = { ...organizationInEdit };
    newOrg[property] = value;
    setOrganizationInEdit(newOrg);
  }
  function onSubmit() {
    ApiService.organizations
      .update(organization.id, organizationInEdit)
      .then((response) => {
        setOrganization(response.data);
        setShowEdit(false);
      })
      .catch((err) => {
        setError(new FormError(err));
      });
  }

  return (
    <>
      <main>
        <div className="display-flex flex-align-center flex-justify">
          <h1>Settings</h1>
          <button className="usa-button margin-y-3" onClick={() => setShowEdit(true)}>
            Edit Settings
          </button>
        </div>
        {showEdit && error && (
          <div className="usa-alert usa-alert--slim usa-alert--error">
            <div className="usa-alert__body">
              <p className="usa-alert__text">{error.message}</p>
            </div>
          </div>
        )}
        <FormCheckbox
          label="Multifactor Authentication"
          disabled={!showEdit}
          currentValue={showEdit ? organizationInEdit.isMfaEnabled : organization.isMfaEnabled}
          onChange={onChange}
          property="isMfaEnabled"
        />
        {showEdit && (
          <ul className="usa-button-group margin-y-3 flex-center">
            <li className="usa-button-group__item">
              <button type="button" className="usa-button" onClick={onSubmit}>
                Save
              </button>
            </li>
            <li className="usa-button-group__item">
              <button type="button" className="usa-button usa-button--unstyled padding-105 text-center" onClick={() => setShowEdit(false)}>
                Close
              </button>
            </li>
          </ul>
        )}
      </main>
    </>
  );
}

export default Settings;
