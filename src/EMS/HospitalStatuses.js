import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import HospitalStatusRow from './HospitalStatusRow';
import HospitalStatusHeader from './HospitalStatusHeader';
import HospitalStatus from '../Models/HospitalStatus';
import ApiService from '../ApiService';

const HospitalStatuses = ({ className, onReturn }) => {
  const [hospitalStatusResponse, setHospitalStatusResponse] = useState([]);

  useEffect(() => {
    ApiService.hospitalStatuses.get().then((response) => {
      setHospitalStatusResponse(response.data);
    });
  }, []);

  return (
    <div className={className}>
      <HospitalStatusHeader />
      <div className="grid-container">
        {hospitalStatusResponse.map((hsData) => {
          const hs = new HospitalStatus(hsData);
          return <HospitalStatusRow key={hs.id} hospitalStatus={hs} />;
        })}
      </div>
      <fieldset className="usa-fieldset">
        <button className="usa-button width-full" type="button" onClick={() => onReturn()}>
          Return to ringdown form
        </button>
      </fieldset>
    </div>
  );
};

HospitalStatuses.propTypes = {
  className: PropTypes.string,
  onReturn: PropTypes.func.isRequired,
};

HospitalStatuses.defaultProps = {
  className: null,
};

export default HospitalStatuses;
