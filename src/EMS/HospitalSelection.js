import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import FormInput from '../Components/FormInput';
import FormRadio from '../Components/FormRadio';

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
    <>
      <div className="usa-accordion">
        <h3 className="usa-accordion__heading">Hospital Selection</h3>
        <div className="usa-accordion__content">
          <fieldset className="usa-fieldset">
            {hospitalStatuses.map((hsu) => (
              <FormRadio
                currentValue={ringdown.hospitalId}
                label={hsu.hospital.name}
                onChange={onChange}
                property="hospitalId"
                value={hsu.hospital.id}
              />
            ))}
          </fieldset>
          <fieldset className="usa-fieldset">
            <FormInput
              label="Arrival at ER"
              onChange={onChange}
              property="etaMinutes"
              required
              showRequiredHint={false}
              size="small"
              type="number"
              unit="min"
              value={ringdown.etaMinutes}
            />
          </fieldset>
        </div>
      </div>
    </>
  );
}

HospitalSelection.propTypes = {
  ringdown: PropTypes.instanceOf(Ringdown).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default HospitalSelection;
