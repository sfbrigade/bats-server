import React from 'react';
import PropTypes from 'prop-types';

import FormInput from '../Components/FormInput';

// add radio button for type and for organization selection?
export default function UserFields({ user }) {
  const handleChange = () => {};

  return (
    <div className="margin-5 padding-3">
    
      <FormInput
        label="First Name"
        onChange={handleChange}
        property="First Name"
        required
        showRequiredHint
        size="medium"
        type="text"
        value={user.firstName}
      />

      <FormInput
        label="Last Name"
        onChange={handleChange}
        property="Last Name"
        required
        showRequiredHint
        size="medium"
        type="text"
        value={user.lastName}
      />

      <FormInput
        label="Email"
        onChange={handleChange}
        property="Email"
        required
        showRequiredHint
        size="medium"
        type="text"
        value={user.email}
      />

      <FormInput
        label="Password"
        onChange={handleChange}
        property="pasword"
        required
        showRequiredHint
        size="medium"
        type="password"
        value="........."
      />
    </div>
  );
}

