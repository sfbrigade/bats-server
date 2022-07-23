import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import FormInput from '../Components/FormInput';
import FormRadio from '../Components/FormRadio';
import Heading from '../Components/Heading';

import Ringdown from '../Models/Ringdown';

import ApiService from '../ApiService';

function HospitalSelection({ ringdown, onChange }) {
  const [hospitalStatuses, setHospitalStatuses] = useState([]);

  useEffect(() => {
    ApiService.hospitalStatuses.get().then((response) => {
      setHospitalStatuses(response.data);
    });
  }, []);

  return (
    <div className="usa-accordion">
      <Heading title={<span className="usa-label--required">Hospital Selection</span>} />
      <div className="usa-accordion__content">
        <fieldset className="usa-fieldset">
          {hospitalStatuses.map((hsu) => (
            <FormRadio
              currentValue={ringdown.hospitalId}
              key={hsu.hospital.id}
              label={hsu.hospital.name}
              onChange={onChange}
              property="hospitalId"
              value={hsu.hospital.id}
              disabled={window.env.DISABLE_PILOT_HOSPITALS && hsu.hospital.name !== 'SF General'}
            />
          ))}
        </fieldset>
        <fieldset className="usa-fieldset">
          <FormInput
            label="ETA"
            onChange={onChange}
            property="etaMinutes"
            required
            size="small"
            type="number"
            unit="min"
            value={ringdown.etaMinutes}
          />
        </fieldset>
      </div>
    </div>
  );
}

HospitalSelection.propTypes = {
  ringdown: PropTypes.instanceOf(Ringdown).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default HospitalSelection;
