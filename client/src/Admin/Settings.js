import React, {useState} from 'react';

function Settings() {

  // In the future, the initial value here will be determined by the result of an api request
  const [isMfaEnabled, setIsMfaEnabled] = useState(false);

  return (
    <>
        <main>
          <div className="display-flex flex-align-center flex-justify">
            <h1>Settings</h1>
          </div>
          Mfa Toggle 
          <input checked={isMfaEnabled} onChange={() => setIsMfaEnabled((curState) => !curState) } type='checkbox'></input>
        </main>
    </>
  );
}

export default Settings;
