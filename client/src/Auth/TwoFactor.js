import React, { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'
import RequiredInput from './Components/RequiredInput';
import { handleValidationEvent } from './Components/helperFunctions';
import ApiService from '../ApiService';
import Context from '../Context';

export default function TwoFactor() {
  const [code, setCode] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const {setUser} = useContext(Context)

const onSubmit = (event) => {
  event.preventDefault();
  console.log('submit here with some validation logic')
  ApiService.auth.twoFactor({code})
  .then((res) => {
    if (res.status === 200){
      // if response is Ok then setUser to returned userObject
      console.log(location.state.user)
      setUser(location.state.user)
      navigate('/')
    }
  }).catch((err) => {
    console.err(err)
    })
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
          <form onSubmit={onSubmit} id="twoFactor" className="usa-form">
            <div className="usa-form-group margin-y-4">
              {/* <input type="text" id="code" name="code" className="usa-input" /> */}
              <RequiredInput
                  type="code"
                  name="code"
                  label="Code"
                  value={code}
                  handleValidationEvent={handleValidationEvent}
                  onChange={setCode}
              />
            </div>
            <button type="submit" className="usa-button width-full">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}
