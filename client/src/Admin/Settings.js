import React, {useState, useContext} from 'react';

import Context from '../Context';
import ApiService from '../ApiService';

import FormCheckbox from '../Components/FormCheckbox';
import './Settings.scss';

function SettingsEdit({
  setShowEdit
}) {

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
            <p id="modal-1-description">
              mfa settings
            </p>
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
  const {organization } = useContext(Context);
  const [isMfaEnabled, setIsMfaEnabled] = useState(organization.isMfaEnabled);
  const [showEdit, setShowEdit] = useState(false);
  
  const handleMfaToggle = () => {
    ApiService.organizations.update(organization.id, {isMfaEnabled: !isMfaEnabled}).then(response => {
      setIsMfaEnabled(response.data.isMfaEnabled);
    })
  }

  return (
    <>
        <main>
          <div className="display-flex flex-align-center flex-justify">
            <h1>Settings</h1>
            <button className="usa-button margin-y-3" onClick={() => setShowEdit(true)}>Edit Settings</button>
          </div>
          <FormCheckbox label="Multifactor authentication" disabled currentValue={isMfaEnabled}/> 
          <input checked={isMfaEnabled} onChange={handleMfaToggle} type='checkbox'></input>
          {showEdit && <SettingsEdit setShowEdit={setShowEdit}/>}
        </main>
    </>
  );
}

export default Settings;
