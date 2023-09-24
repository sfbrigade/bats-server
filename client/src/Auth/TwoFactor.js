import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ApiService from '../ApiService';
import Context from '../Context';

import Error from './Components/Error';
import RequiredInput from './Components/RequiredInput';
import { handleValidationEvent } from './Components/helperFunctions';

export default function TwoFactor() {
  const [code, setCode] = useState('');
  const [invalid, setInvalid] = useState();
  const [error, setError] = useState();
  const navigate = useNavigate();
  const { setUser } = useContext(Context);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const res = await ApiService.auth.twoFactor({ code });
      setUser(res.data);
      navigate('/');
    } catch (err) {
      if (err.response?.status === 422) {
        setInvalid(true);
      } else {
        setError(true);
      }
    }
  }

  return (
    <div className="grid-container">
      <div className="grid-row">
        <div className="grid-col-10 grid-offset-1 tablet:grid-col-6 tablet:grid-offset-3 desktop:grid-col-4 desktop:grid-offset-4">
          <div className="text-center margin-top-6 margin-bottom-8">
            <h1 className="hospital-dest-title">
              <img src="/img/logomark-300.png" className="logo" alt="Routed logo" />
            </h1>
            <h4 className="text-base-light">Please enter the Authorization Code that was sent to your email address.</h4>
          </div>
          {invalid && <Error input="Invalid code." />}
          {error && <Error input="An unexpected error has occurred. Please try again." />}
          <form onSubmit={onSubmit} id="twoFactor" className="usa-form">
            <div className="usa-form-group margin-y-4">
              <RequiredInput
                type="code"
                name="code"
                label="Code"
                value={code}
                handleValidationEvent={handleValidationEvent}
                onChange={setCode}
              />
            </div>
            <button type="submit" className="usa-button width-full">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
