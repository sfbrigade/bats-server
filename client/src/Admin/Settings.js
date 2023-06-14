import React, {useState, useContext} from 'react';

import Context from '../Context';
import ApiService from '../ApiService';

function Settings() {

  // In the future, the initial value here will be determined by the result of an api request
  const [isMfaEnabled, setIsMfaEnabled] = useState(false);
  const {organization } = useContext(Context);
  console.log('organiz', organization)

  const handleMfaToggle = () => {
    // send the api request
    // we also need the organization id
        // Todo: fix the patch below. organization requests have worked in the hospital tab
    ApiService.organizations.patch(organization.id, {isMfaEnabled: !isMfaEnabled}).then(response => {
      console.log(response.data);
      setIsMfaEnabled((curState) => !curState)

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
