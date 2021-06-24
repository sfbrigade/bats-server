import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import ApiService from '../ApiService';

export default function ComboBox({ label, property, required, value, onChange }) {
  
  const [ambulancId, setAmbulanceId] = useState([]);
  const [dispatchCall, setDispatchCall] = useState([]);
  

  // setTimeout(() => {
  // // useEffect(() =>{
  // //   ApiService.ambulances.getIdentifiers().then((response) => {
  // //     setAmbulanceId(response.data.ambulanceIdentifiers);
  // //   });
  // //   ApiService.emsCalls.getDispatchCallNumbers("SFFD-1").then((response) => {
  // //     setAmbulanceId(response.data);
  // //   });
  // //   console.log("rendered");
  // // }, [])
  // }, 200);


  useEffect(() =>{
    ApiService.ambulances.getIdentifiers().then((response) => {
      setAmbulanceId(response.data.ambulanceIdentifiers);
    });
    ApiService.emsCalls.getDispatchCallNumbers("SFFD-4").then((response) => {
      setDispatchCall(response.data.dispatchCallNumbers);
    });
    console.log("rendered");
  }, [])

  const options = [<option />];

  if (property === 'ambulanceIdentifier') {
    
    for (let i = 0; i < ambulancId.length; i += 1) {
      options.push(
        <option key={i} value={value}>
          {ambulancId[i]}
        </option>
      );
    }
  } 

  // console.log(options);
  console.log(dispatchCall);


  return (
    <>
      <label className="usa-label" htmlFor={property}>
        {label}
      </label>
      <div className="usa-combo-box">
        <select
          className="usa-select usa-input--medium"
          name={property}
          id={property}
          required={required}
          onBlur={onChange}
        >
          {options}
        </select>
      </div>
    </>
  );
}

ComboBox.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  property: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
