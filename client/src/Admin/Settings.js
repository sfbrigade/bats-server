import React, {useState, useContext} from 'react';

import Context from '../Context';
import ApiService from '../ApiService';

import FormCheckbox from '../Components/FormCheckbox';
import './Settings.scss';

function SettingsEdit({setShowEdit}) {

  return (
    <>
    <div className="modalOverlay" ></div>
    <div className='modal'>
      <div className="modalHeader">
        Edit Settings
      </div>
      <div className="modalContent">
        Mfa toggle 
      </div>
      <div className="modalActions">
        <button className='actionBtn leftBtn'  onClick={() => setShowEdit(false)}>Cancel</button>
        <button className='actionBtn rightBtn' onClick={() => setShowEdit(false)}>Save</button>
      </div> 
    </div>
    </>
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
