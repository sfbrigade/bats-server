import React from 'react';
import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { updateErrorState, handleValidationEvent } from './helperFunctions';
import RequiredInput from './RequiredInput';
import ApiService from '../../ApiService';

export default function Form(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const navigate = useNavigate()

  function isNotValid() {
    if (email.trim() === '' || password.trim() === '') {
      if (props.username !== null && password.trim() !== '') {
        return false;
      } else return true;
    }
    return false;
  }

  function onSubmit(event) {
    event.preventDefault();
    console.log('handleSubmit')
    if (!isNotValid()) {
      updateErrorState(email);
      updateErrorState(password);
    }
    ApiService.auth.login({username: email, password}).then((response) => {
      // if (response.ok){
      //   navigate('/')
      // }
      console.log(response)
     })
  }


  return (
    <form id="login" className="usa-form" onSubmit={() => onSubmit}>
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
