import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import ApiService from '../ApiService';

export default function ComboBox({ label, property, required, onChange, condition }) {
  const [ambulanceId, setAmbulanceId] = useState([]);
  const [dispatchCall, setDispatchCall] = useState([]);

  useEffect(() => {
    if (condition === '') {
      ApiService.ambulances.getIdentifiers().then((response) => {
        setAmbulanceId(response.data.ambulanceIdentifiers);
      });
    }
    if (condition !== '') {
      ApiService.emsCalls.getDispatchCallNumbers(condition).then((response) => {
        setDispatchCall(response.data.dispatchCallNumbers);
      });
    }
  }, [condition]);

  const options = [<option key={0} />];

  if (property === 'ambulanceIdentifier') {
    for (let i = 0; i < ambulanceId.length; i += 1) {
      options.push(
        <option key={ambulanceId[i]} value={ambulanceId[i]}>
          {ambulanceId[i]}
        </option>
      );
    }
  }
  if (property === 'dispatchCallNumber') {
    for (let i = 0; i < dispatchCall.length; i += 1) {
      options.push(
        <option key={dispatchCall[i]} value={dispatchCall[i]}>
          {dispatchCall[i]}
        </option>
      );
    }
  }

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
          onBlur={(e) => onChange(property, e.target.value)}
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
  condition: PropTypes.string.isRequired,
};
