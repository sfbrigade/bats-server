import React, {useState, useContext} from 'react';

import Context from '../Context';
// import ApiService from '../ApiService';

import FormCheckbox from '../Components/FormCheckbox';
import './Settings.scss';

function SettingsEdit({
  setShowEdit, contextOrganization,
  //  setContextOrganization
}) {

  const [organizationInEdit, setOrganizationInEdit] = useState(contextOrganization);
  function onChange(property, value) {
    const newOrg = { ...organizationInEdit };
    newOrg[property] = value;
    setOrganizationInEdit(newOrg);
  }
  
  return (
    <div className="usa-modal-overlay"
    // onClick={() => setShowEdit(false)}
    >
    <div
      className="usa-modal modal"
      aria-labelledby="modal-1-heading"
      aria-describedby="modal-1-description"
    >
      <div className="usa-modal__content">
        <div className="usa-modal__main">
          <h2 className="usa-modal__heading" id="modal-1-heading">
            Edit Organization Settings
          </h2>
          <div className="usa-prose">
          <FormCheckbox label="Multifactor Authentication" currentValue={organizationInEdit.isMfaEnabled} property='isMfaEnabled' onChange={onChange}/>  
          </div>
          <div className="usa-modal__footer">
            <ul className="usa-button-group">
              <li className="usa-button-group__item">
                <button type="button" className="usa-button" data-close-modal>
                  Save
                </button>
              </li>
              <li className="usa-button-group__item">
                <button
                  type="button"
                  className="usa-button usa-button--unstyled padding-105 text-center"
                  data-close-modal
                  onClick={() => setShowEdit(false)}
                >
                  Close
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

function Settings() {
  const {organization, setOrganization } = useContext(Context);
  const [showEdit, setShowEdit] = useState(false);
  
  // const handleMfaToggle = () => {
  //   ApiService.organizations.update(organization.id, {isMfaEnabled: !isMfaEnabled}).then(response => {
  //     setIsMfaEnabled(response.data.isMfaEnabled);
  //   })
  // }

  return (
    <>
        <main>
          <div className="display-flex flex-align-center flex-justify">
            <h1>Settings</h1>
            <button className="usa-button margin-y-3" onClick={() => setShowEdit(true)}>Edit Settings</button>
          </div>
          <FormCheckbox label="Multifactor Authentication" disabled currentValue={organization.isMfaEnabled}/> 
          {showEdit && <SettingsEdit setShowEdit={setShowEdit} contextOrganization={organization} setContextOrganization={setOrganization}/>}
        </main>
    </>
  );
}

export default Settings;
