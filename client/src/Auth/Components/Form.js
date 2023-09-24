import React from 'react';
import { useContext, useState } from 'react';
import { handleValidationEvent } from './helperFunctions';
import { useNavigate } from 'react-router-dom';
import RequiredInput from './RequiredInput';
import ApiService from '../../ApiService';
import Context from '../../Context';

export default function Form(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(Context);
  const navigate = useNavigate();

  function isNotValid() {
    if (email.trim() === '' || password.trim() === '') {
      if (props.username !== null && password.trim() !== '') {
        return false;
      } else return true;
    }
    return false;
  }

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const res = await ApiService.auth.login({ username: email, password });
      if (res.status === 200) {
        // if status returned 200 should set the userObject in Context
        setUser(res.data);
        // const userData = res.data;
        navigate('/');
      } else if (res.status === 202) {
        console.log('requries mFa redirecting to mFa');
        // if status returne 202 accepted, should not set redirect to mfa
        console.log(res.data);
        navigate('/twoFactor', { state: { user: res.data } });
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form id="login" className="usa-form" onSubmit={onSubmit}>
      <RequiredInput
        type="email"
        name="username"
        label="Username"
        defaultValue={props.username}
        handleValidationEvent={handleValidationEvent}
        onChange={setEmail}
      />
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
  );
}
