import React from 'react';

import FormInput from '../Components/FormInput';

//create model to help store data rather than using useState to create state variables?
// add radio button for type and for organization selection?
export default function NewUserFields(){

    const handleChange = () => {
        alert("changed")
    }

    return (
    
       <div className="margin-5 padding-3">
           {/* Should this be where a temp password is generated?
            Does creation of new user send email to user with password?
            autogenerated usernames?
           */}
           <FormInput
        children
        label="First Name"
        onChange={handleChange}
        property="First Name"
        required={true}
        showRequiredHint={true}
        size="medium"
        type="text"
        value="John"
        />

    <FormInput
        children
        label="Last Name"
        onChange={handleChange}
        property="Last Name"
        required={true}
        showRequiredHint={true}
        size="medium"
        type="text"
        value="Doe"
        />

    <FormInput
        children
        label="Email"
        onChange={handleChange}
        property="Email"
        required={true}
        showRequiredHint={true}
        size="medium"
        type="text"
        value="John@email.com"
        />

    <FormInput
        children
        label="Organization"
        onChange={handleChange}
        property="Organization"
        required={true}
        showRequiredHint={true}
        size="medium"
        type="text"
        value="SFFD"
        />
       </div>
    )
}