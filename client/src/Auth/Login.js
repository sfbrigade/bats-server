import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import ApiService from '../ApiService';
import Context from '../Context';

import Error from './Components/Error';
import RequiredInput from './Components/RequiredInput';
import { handleValidationEvent } from './Components/helperFunctions';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [invalid, setInvalid] = useState();
  const [error, setError] = useState();
  const { setUser } = useContext(Context);
  const navigate = useNavigate();

  function isNotValid() {
    if (email.trim() === '' || password.trim() === '') {
      return true;
    }
    return false;
  }

  async function onSubmit(event) {
    event.preventDefault();
    setError();
    setInvalid();
    try {
      const res = await ApiService.auth.login({ username: email, password });
      if (res.status === 200) {
        // if status returned 200 should set the user in Context
        setUser(res.data);
        // const userData = res.data;
        navigate('/');
      } else if (res.status === 202) {
        // if status returns 202 accepted, redirect to two factor auth
        // console.log('navigating to two factor?');
        navigate('/twoFactor');
      }
    } catch (err) {
      if (err.response?.status === 422) {
        setInvalid(true);
      } else {
        setError(true);
      }
    }
  }

  const url = new URL(window.location.href);
  const auth = url.searchParams.get('auth');
  const reset = url.searchParams.get('reset');

  return (
    <div className="grid-container">
      <div className="grid-row">
        <div className="grid-col-10 grid-offset-1 tablet:grid-col-6 tablet:grid-offset-3 desktop:grid-col-4 desktop:grid-offset-4">
          <div className="text-center margin-top-6 margin-bottom-8">
            <h1 className="hospital-dest-title">
              <img src="/img/logomark-300.png" className="logo" alt="Routed logo" />
            </h1>
            <h4 className="text-base-light">
              Start by entering your
              <br />
              email and password below.
            </h4>
            {reset && <Error input="Your password has been reset. You may now log in." />}
            {auth && <Error input="Invalid attempt. You are not authorized." />}
            {invalid && <Error input="Invalid email and/or password." />}
            {error && <Error input="An unexpected error has occurred. Please try again." />}
            <form id="login" className="usa-form" onSubmit={onSubmit}>
              <RequiredInput type="email" name="username" label="Email" handleValidationEvent={handleValidationEvent} onChange={setEmail} />
              <RequiredInput
                type="password"
                name="password"
                label="Password"
                value={password}
                handleValidationEvent={handleValidationEvent}
                onChange={setPassword}
              />
              <button type="submit" className="usa-button width-full" disabled={isNotValid()}>
                Login
              </button>
            </form>
            <Link to="/reset">
              <button className="usa-button width-full margin-top-3"> Reset Password</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
