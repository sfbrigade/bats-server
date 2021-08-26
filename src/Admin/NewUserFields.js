import React from 'react';

import FormInput from '../Components/FormInput';

export default function NewUserFields(){

    const handleChange = () => {
        alert("changed")
    }

    return (
       <div className="margin-5 padding-3">
           <FormInput
        children
        label="First Name"
        onChange={handleChange}
        property="First Name"
        required={true}
        showRequiredHint={true}
        size="medium"
        type="text"
        min
        max
        unit
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
        min
        max
        unit
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
        min
        max
        unit
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
        min
        max
        unit
        value="SFFD"
        />
       </div>
    )
}