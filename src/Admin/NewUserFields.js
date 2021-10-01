import React from 'react';
import PropTypes from 'prop-types';

import FormInput from '../Components/FormInput';

// create model to help store data rather than using useState to create state variables?
// add radio button for type and for organization selection?
export default function NewUserFields({ user }) {
  const handleChange = () => {};

  return (
    <div className="margin-5 padding-3">
      {/* Should this be where a temp password is generated?
            Does creation of new user send email to user with password?
            autogenerated usernames?
           */}
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
        label="Phone #"
        onChange={handleChange}
        property="Organization"
        required
        showRequiredHint
        size="medium"
        type="text"
        value="(555)555-555"
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
NewUserFields.prototypes = {
  user: PropTypes.shape({
    email: PropTypes.string,
    firstName: PropTypes.string,
    id: PropTypes.string,
    isActive: PropTypes.bool,
    isAdminUser: PropTypes.bool,
    isOperationalUser: PropTypes.bool,
    isSuperUser: PropTypes.bool,
    lastName: PropTypes.string,
  }),
};
