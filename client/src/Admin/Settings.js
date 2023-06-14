import React, {useState, useContext} from 'react';

import Context from '../Context';
import ApiService from '../ApiService';

function Settings() {
  const {organization } = useContext(Context);
  const [isMfaEnabled, setIsMfaEnabled] = useState(organization.isMfaEnabled);
  
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
          </div>
          Mfa Toggle 
          <input checked={isMfaEnabled} onChange={handleMfaToggle} type='checkbox'></input>
        </main>
    </>
  );
}

export default Settings;
