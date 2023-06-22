import React, { useState, useContext, useEffect } from 'react';

import Context from '../Context';
import ApiService from '../ApiService';
import FormError from '../Models/FormError';
import FormCheckbox from '../Components/FormCheckbox';

import './Settings.scss';

// function SettingsEdit({ setShowEdit, contextOrganization, setContextOrganization }) {
//   const [organizationInEdit, setOrganizationInEdit] = useState(contextOrganization);
//   const [error, setError] = useState();

//   function onSubmit() {
//     ApiService.organizations
//       .update(contextOrganization, organizationInEdit)
//       .then((response) => {
//         setContextOrganization(response.data);
//         setShowEdit(false);
//       })
//       .catch((err) => {
//         setError(new FormError(err));
//       });
//   }

//   return (
//     <div className="usa-modal-overlay">
//       <div className="usa-modal modal" aria-labelledby="modal-1-heading" aria-describedby="modal-1-description">
//         <div className="usa-modal__content">
//           <div className="usa-modal__main">
//             <h2 className="usa-modal__heading" id="modal-1-heading">
//               Edit Organization Settings
//             </h2>
//             <div className="usa-prose">

//               <FormCheckbox
//                 label="Multifactor Authentication"
//                 currentValue={organizationInEdit.isMfaEnabled}
//                 property="isMfaEnabled"
//                 onChange={onChange}
//               />
//             </div>
//             <div className="usa-modal__footer">
//               <ul className="usa-button-group">
//                 <li className="usa-button-group__item">
//                   <button type="button" className="usa-button" onClick={onSubmit}>
//                     Save
//                   </button>
//                 </li>
//                 <li className="usa-button-group__item">
//                   <button
//                     type="button"
//                     className="usa-button usa-button--unstyled padding-105 text-center"
//                     onClick={() => setShowEdit(false)}
//                   >
//                     Close
//                   </button>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// Alright let's plan how I want to tackle this refactor
// I'll have a read and an edit state - this will be denoted by a 'isEditMode' state
// The value of the mfa value will be determined by an organization edit value if in edit mode
// Will need to reset the organizationedit to make sure it's same as the contextorganization everytime we go into edit mode.
// That should take care of editing org settings

// upon saving - patch and save new context info  and switch off edit mode
// upon cancelling - jus switch off edit mode

function Settings() {
  const { organization, setOrganization } = useContext(Context);
  const [organizationInEdit, setOrganizationInEdit] = useState(organization);
  const [error, setError] = useState();
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    setOrganizationInEdit(organization);
    setError();
  }, [showEdit]);

  function onChange(property, value) {
    const newOrg = { ...organizationInEdit };
    newOrg[property] = value;
    setOrganizationInEdit(newOrg);
  }
  function onSubmit() {
    ApiService.organizations
      .update(organization.id, organizationInEdit)
      .then((response) => {
        setOrganization(response.data);
        setShowEdit(false);
      })
      .catch((err) => {
        setError(new FormError(err));
      });
  }

  return (
    <>
      <main>
        <div className="display-flex flex-align-center flex-justify">
          <h1>Settings</h1>
          <button className="usa-button margin-y-3" onClick={() => setShowEdit(true)}>
            Edit Settings
          </button>
        </div>
        {showEdit && error && (
          <div className="usa-alert usa-alert--slim usa-alert--error">
            <div className="usa-alert__body">
              <p className="usa-alert__text">{error.message}</p>
            </div>
          </div>
        )}
        <FormCheckbox
          label="Multifactor Authentication"
          disabled={!showEdit}
          currentValue={showEdit ? organizationInEdit.isMfaEnabled : organization.isMfaEnabled}
          onChange={onChange}
          property="isMfaEnabled"
        />
        {showEdit && (
          <ul className="usa-button-group margin-y-3 display-flex">
            <li className="usa-button-group__item">
              <button type="button" className="usa-button" onClick={onSubmit}>
                Save
              </button>
            </li>
            <li className="usa-button-group__item">
              <button type="button" className="usa-button usa-button--unstyled padding-105 text-center" onClick={() => setShowEdit(false)}>
                Close
              </button>
            </li>
          </ul>
        )}
      </main>
    </>
  );
}

export default Settings;
