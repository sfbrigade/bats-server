import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropTypes from 'prop-types';

import FormInput from '../Components/FormInput';
import FormRadio from '../Components/FormRadio';
import Heading from '../Components/Heading';

import Ringdown from '../Models/Ringdown';

import ApiService from '../ApiService';
import FormRadioFieldSet from '../Components/FormRadioFieldSet';

import './HospitalSelection.scss';

function HospitalSelection({ ringdown, onChange }) {
  const [searchParams] = useSearchParams();
  const venueId = searchParams.get('venueId');
  const [hospitalStatuses, setHospitalStatuses] = useState([]);

  useEffect(() => {
    ApiService.hospitalStatuses.index(venueId).then((response) => {
      setHospitalStatuses(response.data);
    });
  }, [venueId]);

  return (
    <div className="usa-accordion">
      <Heading title={<span className="usa-label--required">Hospital Selection</span>} />
      <div className="usa-accordion__content">
        <FormRadioFieldSet className="hospital-selection" property="hospitalId" value={ringdown.hospitalId} onChange={onChange}>
          {hospitalStatuses.map(({ hospital: { id, name } }) => (
            <FormRadio key={id} label={name} value={id} disabled={window.env.DISABLE_PILOT_HOSPITALS && name !== 'SF General'} />
          ))}
        </FormRadioFieldSet>
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
