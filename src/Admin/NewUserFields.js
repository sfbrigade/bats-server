import React from 'react';
import PropTypes from 'prop-types';

import FormInput from '../Components/FormInput';
import User from '../Models/User';

// create model to help store data rather than using useState to create state variables?
// add radio button for type and for organization selection?
export default function NewUserFields({ newUser, onChange }) {
  return (
    <div className="margin-5 padding-3">
      <fieldset className="usa-fieldset">
        <FormInput
          label="First Name"
          onChange={onChange}
          property="firstName"
          required
          size="medium"
          type="text"
          value={newUser.firstName}
        />

        <FormInput label="Last Name" onChange={onChange} property="lastName" required size="medium" type="text" value={newUser.lastName} />

        <FormInput label="Email" onChange={onChange} property="email" required size="medium" type="text" value={newUser.email} />

        <FormInput
          label="Password"
          onChange={onChange}
          property="password"
          required
          size="medium"
          type="password"
          value={newUser.password}
        />
      </fieldset>
    </div>
  );
}
NewUserFields.propTypes = {
  newUser: PropTypes.instanceOf(User).isRequired,
  onChange: PropTypes.func.isRequired,
};
